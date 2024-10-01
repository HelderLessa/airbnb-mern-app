const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

require("dotenv").config();
const app = express();

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? "https://airbnb-mern-app.vercel.app"
    : "http://localhost:5173";
app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get("/api/test", (req, res) => {
  res.json("test ok");
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ message: "All fields are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      name: userDoc.name,
      email: userDoc.email,
    });
  } catch (err) {
    console.error("Failed registering user!", err);

    if (err.code === 11000) {
      return res.status(422).json({ message: "This email is already in use!" });
    }

    res.status(500).json({ message: "Failed registering user!" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      return res.status(401).json({ message: "Invalid credentials!" });
    }
  } else {
    res.status(404).json({ message: "User not found!" });
  }
});

app.get("/api/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json({ message: "Invalid token!" });
      const user = await User.findById(userData.id);
      if (user) {
        res.json({ name: user.name, email: user.email, _id: user._id });
      } else {
        res.status(404).json({ message: "User not found!" });
      }
    });
  } else {
    res.json(null);
  }
});

app.post("/api/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/api/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  try {
    await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
    res.json(newName);
  } catch (error) {
    res.status(500).json({ message: "Error downloading image!" });
  }
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post(
  "/api/upload",
  photosMiddleware.array("photos", 100),
  async (req, res) => {
    const uploadedFiles = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      // Cria uma referência no Firebase Storage para cada arquivo
      const storageRef = ref(storage, `images/${file.originalname}`);

      try {
        // Faz o upload do arquivo para o Firebase Storage
        const snapshot = await uploadBytes(
          storageRef,
          fs.readFileSync(file.path)
        );

        // Obtém a URL de download para armazenar no banco de dados ou retornar ao cliente
        const downloadURL = await getDownloadURL(snapshot.ref);
        uploadedFiles.push(downloadURL);

        // Remove o arquivo temporário do sistema de arquivos local
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error("Error uploading file to Firebase Storage!", error);
        return res.status(500).json({ error: "Error uploading to Firebase!" });
      }
    }

    // Retorna as URLs das imagens carregadas
    res.json(uploadedFiles);
  }
);

app.post("/api/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: "Invalid token!" });
    const placeDoc = await Place.create({
      owner: userData.id,
      price,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get("/api/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: "Invalid token!" });
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/api/places/:id", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  if (place) {
    res.json(place);
  } else {
    res.status(404).json({ message: "Place not found!" });
  }
});

app.put("/api/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: "Invalid token!" });

    const placeDoc = await Place.findById(id);
    if (!placeDoc) {
      return res.status(404).json({ message: "Place not found!" });
    }
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    } else {
      res
        .status(403)
        .json({ message: "You don't have permission to update this place!" });
    }
  });
});

app.get("/api/places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/api/bookings", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
      req.body;

    const bookingDoc = await Booking.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      user: userData.id,
    });
    res.json(bookingDoc);
  } catch (err) {
    console.error("Error creating booking!", err);
    res.status(500).json({ message: "Error creating booking!" });
  }
});

app.get("/api/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
