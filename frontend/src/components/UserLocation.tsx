import { useEffect, useState } from "react";
import { Marker, useMap } from "react-leaflet";
import locationIcon from "../assets/location.svg"
import L from "leaflet";

//todo: change to location and add location to button too
const icon = L.icon({
  iconUrl: locationIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export const UserLocation = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [bbox, setBbox] = useState<string[]>([]);
  const [locate, setLocate] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (locate) {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        setBbox(e.bounds.toBBoxString().split(","));
      });
    }
  }, [locate, map]);

  return (
    <>
      <button style={{display: 'flex', gap: '0.3rem'}} onClick={() => setLocate(true)}><img src={locationIcon} />My Location</button>
      {position === null ? null : (
        <Marker position={position} icon={icon}></Marker>
      )}
    </>
  );
};

