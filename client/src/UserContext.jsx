import api from "./axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getCookie("token");

      if (!token) {
        setReady(true);
        return;
      }

      try {
        const { data } = await api.get("/auth/profile");
        setUser(data);
      } catch (err) {
        console.error(
          "Erro ao buscar perfil:",
          err.response?.data?.message || err.message
        );
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
