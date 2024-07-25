import "../styles/react-aria.css";
import { ethLatLongAbi } from "../generated";
import { useRef } from "react";
import { useButton } from "@react-aria/button";
import { useTextField } from "@react-aria/textfield";
import { useWaitForTransactionReceipt, useWriteContract, type BaseError } from "wagmi";
import { parseLatLong } from "../utils";
import { Heading } from "react-aria-components";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

export const AddLayerForm = ( latlong : { lat : number, long : number }) => {
  const { data: hash, writeContract, isPending } = useWriteContract();
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
    const description = formData.get("description") as string;

    writeContract({
      address: contract_address,
      abi,
      functionName: "addLayer",
      args: [layerName, description, lat, long, 0 ], // todo: replace 0 with color 
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
    label: "Description",
    placeholder: "hello world",
    name: "description",
    isRequired: true
  }, descriptionRef);

  const { inputProps: latInputProps } = useTextField({
    label: "Latitude",
    placeholder: "54",
    name: "lat",
    isRequired: true,
    value: latlong.lat.toString() || "" // Set the initial value from props or empty string if not provided
  }, latRef);

  const { inputProps: longInputProps } = useTextField({
    label: "Longitude",
    placeholder: "-89",
    name: "long",
    isRequired: true,
    value: latlong.long.toString() || "" // Set the initial value from props or empty string if not provided
  }, longRef);

  const { buttonProps } = useButton(
    {
      isDisabled: isPending,
      type: "submit",
    },
    buttonRef
  );

  return (
    <>
      <Heading>Add Layer</Heading>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="layerName">Layer Name</label>
          <input {...layerNameInputProps} ref={layerNameRef} id="layerName" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            {...descriptionInputProps}
            ref={descriptionRef}
            id="description"
          />
        </div>
        <div>
          <label htmlFor="lat">Latitude</label>
          <input {...latInputProps} ref={latRef} id="lat" />
        </div>
        <div>
          <label htmlFor="long">Longitude</label>
          <input {...longInputProps} ref={longRef} id="long" />
        </div>
        <button {...buttonProps} ref={buttonRef}>
          {isPending ? "Confirming..." : "Post"}
        </button>
        {isConfirming && <div> Waiting for confirmation... </div>}
        {isConfirmed && <div> Transaction confirmed. </div>}
        {error && (
          <div>
            {" "}
            Error: {(error as BaseError).shortMessage || error.message}
          </div>
        )}
      </form>
    </>
  );
}