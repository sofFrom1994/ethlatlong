import "../styles/react-aria.css";

import { ethLatLongAbi } from "../generated";
import { useRef, useState } from "react";
import { useButton } from "@react-aria/button";
import { useTextField } from "@react-aria/textfield";
import {
  BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseLatLong } from "../utils";
import { Button, FieldError, Header, Heading, Key, Label, ListBox, ListBoxItem, Popover, Section, Select, SelectValue } from "react-aria-components";
import { layerType } from "./types";
import { SelectWrapper } from "./SelectWrapper";
import { ReadContractErrorType } from "wagmi/actions";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

// todo: next to post, have a div that is empty with low opacity 
// so the person sees their marker one last time

export const AddMessageForm = (props: { lat: number; long: number, layers : layerType[], error :  ReadContractErrorType | null }) => {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const descriptionRef = useRef(null);
  const latRef = useRef(null);
  const longRef = useRef(null);
  const buttonRef = useRef(null);

  let [selectedLayer, setLayer] = useState<Key>();

  if (props.error) {
    console.log(props.error);
    return <></>;
  } 

  if (!props.layers || props.layers.length === 0) {
    console.log("no layers to select")
  } 

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
      value: props.lat.toString(),
    },
    latRef
  );

  const { inputProps: longInputProps } = useTextField(
    {
      label: "Longitude",
      placeholder: "-89",
      name: "long",
      isRequired: true,
      value: props.long.toString(),
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

  const layerListBoxes = props.layers.map((layer) => {
    return (
          <ListBoxItem id={layer.name}>{layer.name}</ListBoxItem>
    )
  })

  return (
    <>
      <h3>Add Message</h3>
      <form onSubmit={submit}>
          <Select name="layerName">
            <Label>Choose a Layer</Label>
            <Button>
              <SelectValue tabIndex={0}>
                {({ defaultChildren, isPlaceholder }) => {
                  return isPlaceholder ? (
                    <>
                      <b>Layer</b>
                    </>
                  ) : (
                    defaultChildren
                  );
                }}
              </SelectValue>
              <span aria-hidden="true">▼</span>
            </Button>
            <Popover style={{zIndex: 2147483647}}>
              <ListBox>
                {layerListBoxes}
              </ListBox>
            </Popover>
          </Select>
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
          <label htmlFor="lat">Latitude: &nbsp; &nbsp;</label>
          <input {...latInputProps} ref={latRef} id="lat" />
        </div>
        <div>
          <label htmlFor="long">Longitude: </label>
          <input {...longInputProps} ref={longRef} id="long" />
        </div>
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
