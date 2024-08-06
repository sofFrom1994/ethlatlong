import "../styles/react-aria.css";

import { ethLatLongAbi } from "../generated";
import { useRef } from "react";
import { useButton } from "@react-aria/button";
import { useTextField } from "@react-aria/textfield";
import {
  BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseLatLong } from "../utils";
import { Heading } from "react-aria-components";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

// todo: next to post, have a div that is empty with low opacity 
// so the person sees their marker one last time

export const AddMessageForm = (latlong: { lat: number; long: number }) => {
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
      address: contract_address,
      abi,
      functionName: "addMessage",
      args: [layerName, lat, long, message],
    });
  }

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error,
  } = useWaitForTransactionReceipt({ hash });

  const { inputProps: layerNameInputProps } = useTextField(
    {
      label: "Layer Name",
      placeholder: "layer 1",
      name: "layerName",
      isRequired: true,
    },
    layerNameRef
  );

  const { inputProps: descriptionInputProps } = useTextField(
    {
      label: "Message",
      placeholder: "hello world",
      name: "message",
      inputElementType: "textarea",
      isRequired: true,
    },
    descriptionRef
  );

  const { inputProps: latInputProps } = useTextField(
    {
      label: "Latitude",
      placeholder: "54",
      name: "lat",
      isRequired: true,
      value: latlong.lat.toString(),
    },
    latRef
  );

  const { inputProps: longInputProps } = useTextField(
    {
      label: "Longitude",
      placeholder: "-89",
      name: "long",
      isRequired: true,
      value: latlong.long.toString(),
    },
    longRef
  );

  const { buttonProps } = useButton(
    {
      isDisabled: isPending,
      type: "submit",
    },
    buttonRef
  );

  return (
    <>
      <Heading>Add Message</Heading>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="layerName">Choose a layer: </label>
          <br /> 
          <input {...layerNameInputProps} ref={layerNameRef} id="layerName" />
        </div>
        <div>
          <label htmlFor="Message">Message:</label>
          <br />
          <textarea
            {...descriptionInputProps}
            ref={descriptionRef}
            id="description"
            rows={5}
            cols={30}
          />
        </div>
        <div>
          <label htmlFor="lat">Latitude: </label>
          <br />
          <input {...latInputProps} ref={latRef} id="lat" />
        </div>
        <div>
          <label htmlFor="long">Longitude: </label>
          <br />
          <input {...longInputProps} ref={longRef} id="long" />
        </div>
        <br />
        <button {...buttonProps} ref={buttonRef}>
          Post
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
};
