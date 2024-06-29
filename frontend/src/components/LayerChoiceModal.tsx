import { useReadContract } from 'wagmi'
import { ethLatLongAbi } from '../generated'

const abi = ethLatLongAbi;

export const LayerChoiceModal = () => {
  const { 
    data,
    error,
    isPending
  } = useReadContract({
    abi,
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName: 'getLayer',
    args: ["layer 1"],
  })

  if (isPending) return <div>Loading...</div>

  if (error)
    return (
      <div>
        Error: {(error).shortMessage || error.message}
      </div>
    )

  return (
    <div>Layer: {data?.name}</div>
  )
}