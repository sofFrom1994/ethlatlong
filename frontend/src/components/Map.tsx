import {
  FeatureGroup,
  LayerGroup,
  LayersControl,
  MapContainer,
  TileLayer,
} from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { Layer } from "./types";
import { MinimapControl } from "./MinimapControl";
import { DraggableMarker } from "./DraggableMarker";

interface MapProps {
  posix?: LatLngExpression | LatLngTuple;
  zoom?: number;
  layers?: [Layer];
}

const baseLayer: Layer = {
  name: "baseLayer",
  baseLocation: [0, 0],
};

const defaults: MapProps = {
  zoom: 12,
  posix: [0, 0],
  layers: [baseLayer],
};

function MapPlaceholder() {
  return (
    <p>
      Map. <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

const Map = (Map: MapProps) => {
  const { zoom = defaults.zoom } = Map;
  return (
    <div className="map-wrapper" >
      <MapContainer
        zoom={zoom}
        scrollWheelZoom={false}
        placeholder={<MapPlaceholder />}
        center={[51.505, -0.09]}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayersControl position="topright">
          <LayersControl.Overlay name="draggable marker">
            <DraggableMarker />
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Layer group with circles">
            <LayerGroup>
              <LayerGroup>
              </LayerGroup>
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Feature group">
            <FeatureGroup pathOptions={{ color: "purple" }}>
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>
        <MinimapControl position="bottomright" zoom={5} />
      </MapContainer>
      <div className="map-controls">
        <p> your location </p>
        <div className="plus"> + </div>
        <p> filter </p>
      </div>
    </div>
  );
};

export default Map;
