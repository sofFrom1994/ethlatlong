import * as React from 'react'
import { useWriteContract } from 'wagmi';
 
export function AddMessage() {
  const { data: hash, writeContract } = useWriteContract()

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lat = formData.get("lat") as string;
    const long = formData.get("long") as string;

        writeContract({
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          abi,
          functionName: "addMessage",
          args: [BigInt(tokenId)],
        });

  }
  return (
    <form onSubmit={submit}>
      <input name="lat" placeholder="54" required />
      <input name="long" placeholder="-89" required />
      <button type="submit">Mint</button>
    </form>
  );
}