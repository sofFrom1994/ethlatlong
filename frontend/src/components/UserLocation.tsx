import locationSVG from "../assets/location.svg?raw";
import fixedLocationSVG from "../assets/location-outline-fixed.svg";

import { useEffect, useState } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";

import { coloredIcon } from "../utils";

const locationIcon = coloredIcon("1CA7EC", locationSVG);

export const UserLocation = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [bbox, setBbox] = useState<string[]>([]);
  const [locate, setLocate] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (locate) {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, 19);
        setBbox(e.bounds.toBBoxString().split(","));
        setLocate(false);
      });
    }
  }, [locate, map]);

  return (
    <>
      <button onClick={() => setLocate(true)}>
        <img
          width="24;"
          height="24"
          alt="my location"
          src={fixedLocationSVG}
        />
      </button>
      {position === null ? null : (
        <Marker position={position} icon={locationIcon}></Marker>
      )}
    </>
  );
};
