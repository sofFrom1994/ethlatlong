type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

// the following should match the generated.ts types
export type embedType = {
  id: bigint;
  kind: number;
  message: string;
  lat: bigint;
  long: bigint;
  author: `0x${string}`;
  url: string;
  description: string;
}

export type layerType = {
  id: bigint;
  name: string;
  description: string;
  embedN: bigint;
  embeds: readonly embedType[];
  lat: bigint;
  long: bigint;
  author: `0x${string}`;
  color: number;
}

export type markerFilter = {
  message: boolean,
  media: boolean,
  path: boolean
  cast: boolean
}