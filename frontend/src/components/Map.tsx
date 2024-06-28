import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
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
  zoom: 12,
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
      center={[51.505, -0.09]}
      style={{ height: "300px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[51.505, -0.09]}>
        <Popup>
          <p>A pretty CSS3 popup. <br /> Easily customizable.</p>
        </Popup>
      </Marker>
    </MapContainer>
  );
};


export default Map