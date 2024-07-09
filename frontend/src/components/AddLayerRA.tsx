import "../styles/react-aria.css"

import { ethLatLongAbi } from "../generated";
import { useRef } from "react";
import { useButton } from "@react-aria/button";
import { useTextField } from "@react-aria/textfield";
import { useWriteContract } from "wagmi";

const abi = ethLatLongAbi;

export function AddLayerRA() {
  const { writeContract } = useWriteContract();
  const layerNameRef = useRef(null);
  const descriptionRef = useRef(null);
  const latRef = useRef(null);
  const longRef = useRef(null);
  const buttonRef = useRef(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lat = formData.get("lat") as string;
    const long = formData.get("long") as string;
    const layerName = formData.get("layerName") as string;
    const description = formData.get("description") as string;

    writeContract({
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi,
      functionName: "addLayer",
      args: [layerName, description, BigInt(Math.floor(Number(lat))), BigInt(Math.floor(Number(long)))],
    });
  }

  const { inputProps: layerNameInputProps } = useTextField({
    label: "Layer Name",
    placeholder: "layer 1",
    name: "layerName",
    isRequired: true
  }, layerNameRef);

  const { inputProps: descriptionInputProps } = useTextField({
    label: "Description",
    placeholder: "hello world",
    name: "description",
    isRequired: true
  }, descriptionRef);

  const { inputProps: latInputProps } = useTextField({
    label: "Latitude",
    placeholder: "54",
    name: "lat",
    isRequired: true
  }, latRef);

  const { inputProps: longInputProps } = useTextField({
    label: "Longitude",
    placeholder: "-89",
    name: "long",
    isRequired: true
  }, longRef);

  const { buttonProps } = useButton({
    type: "submit",
  }, buttonRef);

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="layerName">Layer Name</label>
        <input {...layerNameInputProps} ref={layerNameRef} id="layerName" />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input {...descriptionInputProps} ref={descriptionRef} id="description" />
      </div>
      <div>
        <label htmlFor="lat">Latitude</label>
        <input {...latInputProps} ref={latRef} id="lat" />
      </div>
      <div>
        <label htmlFor="long">Longitude</label>
        <input {...longInputProps} ref={longRef} id="long" />
      </div>
      <button {...buttonProps} ref={buttonRef}>Post</button>
    </form>
  );
}
