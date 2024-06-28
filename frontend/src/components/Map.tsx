import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';

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

function MapPlaceholder() {
  return (
    <p>
      Map.{' '}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  )
}

const Map = (Map: MapProps) => {
  const { zoom = defaults.zoom, posix = defaults.posix } = Map;
  return (
      <MapContainer
        zoom={zoom}
        scrollWheelZoom={false}
        placeholder={<MapPlaceholder />}
        center={[-300, 300]}
        style={{height: "300px"}}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
  );
};


export default Map