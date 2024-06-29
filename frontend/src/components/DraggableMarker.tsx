import { useCallback, useMemo, useRef, useState } from "react";
import L, { LatLng } from 'leaflet';
import { Marker, Popup } from "react-leaflet";
import { LatLngTuple } from "leaflet";

const center = [51.505, -0.09] as LatLngTuple;

export const DraggableMarker = () => {
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