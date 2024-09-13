type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export type markerFilter = {
  message: boolean,
  media: boolean,
  path: boolean
  cast: boolean
}

// the following should match the generated.ts types
export type embedType = {
  id: bigint;
  kind: number;
  message: string;
  lat: bigint;
  long: bigint;
  author: `0x${string}`;
  url: string;
  timestamp: bigint;
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
