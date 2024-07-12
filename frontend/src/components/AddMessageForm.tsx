import "../styles/react-aria.css"

import { ethLatLongAbi } from "../generated";
import { useRef } from "react";
import { useButton } from "@react-aria/button";
import { useTextField } from "@react-aria/textfield";
import { BaseError, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseLatLong } from "../utils";

const abi = ethLatLongAbi;

export const AddMessageForm = (latlong : { lat : number, long : number } ) => {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const layerNameRef = useRef(null);
  const descriptionRef = useRef(null);
  const latRef = useRef(null);
  const longRef = useRef(null);
  const buttonRef = useRef(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lat = parseLatLong(formData.get("lat") as string);
    const long = parseLatLong(formData.get("long") as string);
    const layerName = formData.get("layerName") as string;
    const message = formData.get("message") as string;

    writeContract({
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi,
      functionName: "addMessage",
      args: [layerName, lat, long, message],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed, error } = useWaitForTransactionReceipt({ hash })

  const { inputProps: layerNameInputProps } = useTextField({
    label: "Layer Name",
    placeholder: "layer 1",
    name: "layerName",
    isRequired: true
  }, layerNameRef);

  const { inputProps: descriptionInputProps } = useTextField({
    label: "Message",
    placeholder: "hello world",
    name: "message",
    isRequired: true,
  }, descriptionRef);

  const { inputProps: latInputProps } = useTextField({
    label: "Latitude",
    placeholder: "54",
    name: "lat",
    isRequired: true,
    value: latlong.lat.toString()
  }, latRef);

  const { inputProps: longInputProps } = useTextField({
    label: "Longitude",
    placeholder: "-89",
    name: "long",
    isRequired: true,
    value: latlong.long.toString()
  }, longRef);

  const { buttonProps } = useButton({
    isDisabled: isPending,
    type: "submit",
  }, buttonRef);

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="layerName">Layer Name</label>
        <input {...layerNameInputProps} ref={layerNameRef} id="layerName" />
      </div>
      <div>
        <label htmlFor="Message">Message</label>
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
       {isConfirming && <div> Waiting for confirmation... </div>}
      {isConfirmed && <div> Transaction confirmed. </div>}
      {error && (
        <div> Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
}
