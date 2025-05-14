import React from "react";

export default function PlaceImg({ place, index = 0, className = null }) {
  if (!place.photos?.length) {
    return "";
  }
  if (!className) {
    className = "object-contain w-full h-full";
  }
  return <img className={className} src={place.photos[index]} alt="" />;
}
