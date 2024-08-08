import { parseUnits } from 'viem'
import { Color } from './components/types';
import L from 'leaflet';

export const parseLatLong = (latlong : string) => {
  return parseUnits(latlong, 18)
}

export const coloredIcon = (color: Color, svg: string, iconSize : L.PointExpression = [15, 15], iconAnchor : L.PointExpression = [9, 15]) => {
  const htmlS = `<span style="color: #${color};">${svg}</span>`;
  return L.divIcon({
    iconUrl: svg,
    className: "colored-icon",
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    html: htmlS
  });
}