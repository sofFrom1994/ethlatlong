"use client"

import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Color } from "../types/util";

type Message = string

type Cast = {
  message : string
}

type Media = {
  name: string
  url : string
}

type ContentTypes = Message | Cast | Media

type Content = {
  name: string,
  data: ContentTypes
  color: Color
}

type Layer = {
  name : string,
  content? : [Content]
  baseLocation : LatLngExpression | LatLngTuple
  color?: Color
}

interface MapProps {
    posix?: LatLngExpression | LatLngTuple,
    zoom?: number,
    layers?: [Layer]
}

const baseLayer : Layer = {
  name: "baseLayer",
  baseLocation: [0,0]
}

const defaults : MapProps = {
  zoom: 19,
  posix: [0, 0],
  layers: [baseLayer]
};

const Map = (Map: MapProps) => {
  const { zoom = defaults.zoom, posix = defaults.posix } = Map;

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};


export default Map