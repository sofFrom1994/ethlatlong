import { parseUnits } from 'viem'
import { Color } from './components/types';
import L from 'leaflet';

export const parseLatLong = (latlong : string) => {
  return parseUnits(latlong, 18)
}

export const coloredIcon = (color: Color, svg: string, iconSize : L.PointExpression = [15, 15], iconAnchor : L.PointExpression = [9, 15], opacity=0.70, popupAnchor : L.PointExpression = [0, -8]) => {
  const htmlS = `<span style="color: #${color};opacity: ${opacity};">${svg}</span>`;
  return L.divIcon({
    iconUrl: svg,
    className: "colored-icon",
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
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

export class LocalStorageManager {
  static get(key : string) {
      return window.localStorage.getItem(key);
  }

  static set = (
    key: string,
    value: any,
  ) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error: any) {
      console.warn(`localStorage.setItem error: ${error.message}`);
      return false;
    }
  };

  static delete = (key : string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error: any) {
      console.warn(`localStorage.removeItem error: ${error.message}`);
    }
  };
}