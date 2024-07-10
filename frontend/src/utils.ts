import { parseUnits } from 'viem'

export const parseLatLong = (latlong : string) => {
  return parseUnits(latlong, 18)
}
