type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export type Message = string

export type Cast = {
  message : string
}

export type Media = {
  name: string
  url : string
}

export type ContentTypes = Message | Cast | Media

export type Content = {
  name: string,
  data: ContentTypes
  color: Color
}

export type Layer = {
  name : string,
  content? : [Content]
  baseLocation : LatLngExpression | LatLngTuple
  color?: Color
}