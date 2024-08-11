import "../styles/react-aria.css";
import { ethLatLongAbi } from "../generated";
import { useContext, useRef, useState } from "react";
import { useButton } from "@react-aria/button";
import { useTextField } from "@react-aria/textfield";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  type BaseError,
} from "wagmi";
import { parseLatLong } from "../utils";
import { Button, Heading, OverlayTriggerStateContext, parseColor } from "react-aria-components";
import { ColorArea } from "./ColorArea";
import { ColorSlider } from "./ColorSlider";
import { CloseButton } from "./CloseButton";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;



export const AddLayerForm = (props: { lat: number; long: number }) => {
  const { data: hash, writeContract, isPending } = useWriteContract();
  const layerNameRef = useRef(null);
  const descriptionRef = useRef(null);
  const latRef = useRef(null);
  const longRef = useRef(null);
  const buttonRef = useRef(null);

  let [color, setColor] = useState(parseColor("hsba(219, 58%, 93%, 1)"));
  let [endColor, setEndColor] = useState(color);
  let [xChannel, yChannel, zChannel] = color.getColorChannels();

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
      args: [layerName, description, lat, long, color.toHexInt()],
    });
  }

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error,
  } = useWaitForTransactionReceipt({ hash });

  const { inputProps: layerNameInputProps,  isInvalid, errorMessageProps, validationErrors} = useTextField(
    {
      label: "Layer Name",
      placeholder: "layer 1",
      name: "layerName",
      isRequired: true,
      validationBehavior: "native"
    },
    layerNameRef
  );

  const { inputProps: descriptionInputProps } = useTextField(
    {
      label: "Description",
      placeholder: "hello world",
      name: "description",
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
      value: props.lat.toString() || "", // Set the initial value from props or empty string if not provided
    },
    latRef
  );

  const { inputProps: longInputProps } = useTextField(
    {
      label: "Longitude",
      placeholder: "-89",
      name: "long",
      isRequired: true,
      value: props.long.toString() || "", // Set the initial value from props or empty string if not provided
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
      <span style={{height: "1rem",marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "1fr auto"}}>
        <h3 style={{ margin: 0, padding: 0, display: "inline-block"}}>Add Layer</h3>
        <CloseButton />
      </span>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="layerName">Layer Name: </label>
          <input {...layerNameInputProps} ref={layerNameRef} id="layerName" />
          {isInvalid && (
            <div
              {...errorMessageProps}
              style={{ color: "red", fontSize: "1rem", fontWeight: "bolder" }}
            >
              {validationErrors.join(" ")}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="description">Description: &nbsp;</label>
          <input
            {...descriptionInputProps}
            ref={descriptionRef}
            id="description"
          />
        </div>
        <div>
          <label htmlFor="lat">Latitude: &nbsp;&nbsp;&nbsp;</label>
          <input {...latInputProps} ref={latRef} id="lat" />
        </div>
        <div>
          <label htmlFor="long">Longitude: </label>
          <input {...longInputProps} ref={longRef} id="long" />
        </div>
        <>
          <label id="hsb-label-id-1">Color: </label>
          <div>
            <div>
              <ColorArea
                aria-labelledby="hsb-label-id-1"
                value={color}
                onChange={setColor}
                onChangeEnd={setEndColor}
                xChannel={xChannel}
                yChannel={yChannel}
              />
              <ColorSlider
                channel={zChannel}
                value={color}
                onChange={setColor}
                onChangeEnd={setEndColor}
              />
            </div>
          </div>
        </>
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
};
