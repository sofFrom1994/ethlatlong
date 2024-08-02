import { parseUnits } from 'viem'
import { Color } from './components/types';
import L from 'leaflet';

export const parseLatLong = (latlong : string) => {
  return parseUnits(latlong, 18)
}

export const coloredIcon = (color: Color, svg: string, iconSize : L.PointExpression = [25, 41]) => {
  const htmlS = `<span style="color: #${color};">${svg}</span>`;
  return L.divIcon({
    iconUrl: svg,
    className: "emptyDummy",
    iconSize: iconSize,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    html: htmlS
  });
}