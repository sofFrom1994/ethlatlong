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
import {
  parseColor,
} from "react-aria-components";
import { ColorArea } from "./ColorArea";
import { ColorSlider } from "./ColorSlider";
import { CloseButton } from "./CloseButton";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

export const AddLayerForm = (props: { lat: number; long: number, refetch }) => {
  const { data: hash, writeContract, isPending, error, status } = useWriteContract();
  const layerNameRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

  let [color, setColor] = useState(parseColor("hsba(219, 58%, 93%, 1)"));
  let [endColor, setEndColor] = useState(color);
  let [xChannel, yChannel, zChannel] = color.getColorChannels();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const layerName = formData.get("layerName") as string;
    const description = formData.get("description") as string;

   writeContract({
      address: contract_address,
      abi,
      functionName: "addLayer",
      args: [layerName, description, parseLatLong(props.lat.toString()), parseLatLong(props.long.toString()), color.toHexInt()],
    });
  }

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  const {
    inputProps: layerNameInputProps,
    isInvalid,
    errorMessageProps,
    validationErrors,
  } = useTextField(
    {
      label: "Layer Name",
      placeholder: "layer 1",
      name: "layerName",
      isRequired: true,
      validationBehavior: "native",
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

  const { buttonProps } = useButton(
    {
      isDisabled: isPending,
      type: "submit",
    },
    buttonRef
  );

  if (status === "success") {
    props.refetch();
  }

  return (
    <>
      <span
        style={{
          height: "1rem",
          marginBottom: "1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr auto",
        }}
      >
        <h3 style={{ margin: 0, padding: 0, display: "inline-block" }}>
          Add Layer
        </h3>
        <CloseButton label="x"/>
      </span>
      <form onSubmit={submit}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label htmlFor="layerName">Name: </label>
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
          <p> Location: ( {props.lat.toFixed(5)}, {props.long.toFixed(5)} )</p>
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
