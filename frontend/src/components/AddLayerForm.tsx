import "../styles/react-aria.css";
import { ethLatLongAbi } from "../generated";
import { useRef, useState } from "react";
import { useButton } from "@react-aria/button";
import { useTextField } from "@react-aria/textfield";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  type BaseError,
} from "wagmi";
import { parseLatLong } from "../utils";
import { ColorSwatch, Heading, parseColor } from "react-aria-components";
import { ColorArea } from "./ColorArea";
import { ColorSlider } from "./ColorSlider";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

export const AddLayerForm = (latlong: { lat: number; long: number }) => {
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
      args: [layerName, description, lat, long, color.toHexInt()]
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
      value: latlong.lat.toString() || "", // Set the initial value from props or empty string if not provided
    },
    latRef
  );

  const { inputProps: longInputProps } = useTextField(
    {
      label: "Longitude",
      placeholder: "-89",
      name: "long",
      isRequired: true,
      value: latlong.long.toString() || "", // Set the initial value from props or empty string if not provided
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
      <Heading>Add Layer</Heading>
      <form onSubmit={submit} style={{ overflow: "scroll"}}>
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

        <>
          <label id="hsb-label-id-1">
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                }}
              >

              </div>
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                }}
              >
              </div>
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
