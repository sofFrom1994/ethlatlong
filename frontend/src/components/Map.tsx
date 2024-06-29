import {
  Circle,
  FeatureGroup,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { Layer } from "./types";
import { useCallback, useMemo, useRef, useState } from "react";
import L, { LatLng } from 'leaflet';
import { useEventHandlers } from '@react-leaflet/core'

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

const center = [51.505, -0.09] as LatLngTuple;
const rectangle = [
  [51.49, -0.08] as LatLngTuple,
  [51.5, -0.06] as LatLngTuple,
]

// Classes used by Leaflet to position controls
const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

const BOUNDS_STYLE = { weight: 1 }

function MinimapBounds({ parentMap, zoom }) {
  const minimap = useMap()

  // Clicking a point on the minimap sets the parent's map center
  const onClick = useCallback(
    (e) => {
      parentMap.setView(e.latlng, parentMap.getZoom())
    },
    [parentMap],
  )
  useMapEvent('click', onClick)

  // Keep track of bounds in state to trigger renders
  const [bounds, setBounds] = useState(parentMap.getBounds())
  const onChange = useCallback(() => {
    setBounds(parentMap.getBounds())
    // Update the minimap's view to match the parent map's center and zoom
    minimap.setView(parentMap.getCenter(), zoom)
  }, [minimap, parentMap, zoom])

  // Listen to events on the parent map
  const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [])
  useEventHandlers({ instance: parentMap }, handlers)

  return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />
}

function MinimapControl({ position, zoom }) {
  const parentMap = useMap()
  const mapZoom = zoom || 0

  // Memoize the minimap so it's not affected by position changes
  const minimap = useMemo(
    () => (
      <MapContainer
        style={{ height: 80, width: 80 }}
        center={parentMap.getCenter()}
        zoom={mapZoom}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
      </MapContainer>
    ),
    [],
  )

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright
  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{minimap}</div>
    </div>
  )
}


function MapPlaceholder() {
  return (
    <p>
      Map. <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

function DraggableMarker() {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState<LatLng>(new L.LatLng(center[0], center[1]));
  const markerRef = useRef<L.Marker<any>>(null);

  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        setPosition(marker.getLatLng());
      }
    },
  }), []);

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}>
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  );
}


const Map = (Map: MapProps) => {
  const { zoom = defaults.zoom } = Map;
  return (
    <MapContainer
      zoom={zoom}
      scrollWheelZoom={false}
      placeholder={<MapPlaceholder />}
      center={[51.505, -0.09]}
      style={{ height: "60%", width: "80%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      <LayersControl position="topright">
        <LayersControl.Overlay name="Marker with popup">
          <DraggableMarker />
          <Marker position={center}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Layer group with circles">
          <LayerGroup>
            <Circle
              center={center}
              pathOptions={{ fillColor: "blue" }}
              radius={200}
            />
            <Circle
              center={center}
              pathOptions={{ fillColor: "red" }}
              radius={100}
              stroke={false}
            />
            <LayerGroup>
              <Circle
                center={[51.51, -0.08]}
                pathOptions={{ color: "green", fillColor: "green" }}
                radius={100}
              />
            </LayerGroup>
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Feature group">
          <FeatureGroup pathOptions={{ color: "purple" }}>
            <Popup>Popup in FeatureGroup</Popup>
            <Circle center={[51.51, -0.06]} radius={200} />
            <Rectangle bounds={rectangle} />
          </FeatureGroup>
        </LayersControl.Overlay>
      </LayersControl>

      <Marker position={[51.505, -0.09]}>
        <Popup>
          <p>
            A pretty CSS3 popup. <br /> Easily customizable.
          </p>
        </Popup>
      </Marker>
      <MinimapControl position="bottomright" zoom={5}/>
    </MapContainer>
  );
};

export default Map;
