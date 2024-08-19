import { parseUnits } from 'viem'
import { Color } from './components/types';
import L from 'leaflet';

export const parseLatLong = (latlong : string) => {
  return parseUnits(latlong, 18)
}

export const coloredIcon = (color: Color, svg: string, iconSize : L.PointExpression = [15, 15], iconAnchor : L.PointExpression = [9, 15], opacity=0.70) => {
  const htmlS = `<span style="color: #${color};opacity: ${opacity};">${svg}</span>`;
  return L.divIcon({
    iconUrl: svg,
    className: "colored-icon",
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    html: htmlS
  });
}

export const coloredSVG = (color: Color, svg: string) => {
  return (
    <span style={{color: color}} dangerouslySetInnerHTML={{__html: svg}} />
  )
}

export const nToColor = (nColor: number) => {
  if (nColor === 0) {
    return "000000"
  }
  return nColor.toString(16) as Color;
};