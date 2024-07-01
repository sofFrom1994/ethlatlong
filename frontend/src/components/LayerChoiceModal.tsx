import { useReadContract } from 'wagmi'
import { ethLatLongAbi } from '../generated'
import { LayersControl, Marker, Popup } from 'react-leaflet';

const abi = ethLatLongAbi;

export const LayerChoiceModal = () => {
  const { 
    data,
    error,
    isPending
  } = useReadContract({
    abi,
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName: 'getAllLayers',
  })

  if (isPending) return <div>Loading...</div>

  if (error)
    return (
      <div>
        Error: {(error).shortMessage || error.message}
      </div>
    )

   return (
    <LayersControl>
      {
        data?.map(l => (
          layerToLayerControlOverlay(l)
        ))
      }
    </LayersControl>
   )
}

const layerToLayerControlOverlay = (
  l: {
    name: string;
    description: string;
    embedN: bigint;
    embeds: readonly {
        id: bigint;
        kind: number;
        message: string;
        lat: bigint;
        long: bigint;
        author: `0x${string}`;
    }[];
    lat: bigint;
    long: bigint;
    author: `0x${string}`;
}
) => {


  return (

   <LayersControl.Overlay name={l.name}>

{ l.embeds.map(em => 
        <Marker position={[Number(em.lat), Number(em.long)] }>
          <Popup>
            {em.message}
              by 
            {em.author}
          </Popup>
        </Marker>

)
}
      </LayersControl.Overlay>
  )
}