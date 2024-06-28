import * as React from "react";
import { useWriteContract } from "wagmi";
import { abi } from "./ethLatLongABI";

export function AddMessage() {
  const { writeContract } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lat = formData.get("lat") as string;
    const long = formData.get("long") as string;
    const layerName = formData.get("layerName") as string;
    const message = formData.get("message") as string;

    writeContract({
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi,
      functionName: "addMessage",
      args: [layerName, BigInt(lat), BigInt(long), message],
    });
  }
  return (
    <form onSubmit={submit}>
      <input name="message" placeholder="hello world" required />
      <input name="layerName" placeholder="layer 1" required />
      <input name="lat" placeholder="54" required />
      <input name="long" placeholder="-89" required />
      <button type="submit">Post</button>
    </form>
  );
}
