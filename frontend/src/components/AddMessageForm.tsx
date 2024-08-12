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
import { Button, Label, ListBox, ListBoxItem, Popover, Select, SelectValue } from "react-aria-components";
import { layerType } from "./types";
import { ReadContractErrorType } from "wagmi/actions";
import { CloseButton } from "./CloseButton";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

export const AddMessageForm = (props: { lat: number; long: number, layers : layerType[], error :  ReadContractErrorType | null }) => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

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
    const layerName = formData.get("layerName") as string;
    const message = formData.get("message") as string;

    writeContract({
      address: contract_address,
      abi,
      functionName: "addMessage",
      args: [layerName, parseLatLong(props.lat.toString()), parseLatLong(props.long.toString()), message],
    });
  }

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
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
      <span style={{height: "1rem",marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "1fr auto"}}>
        <h3 style={{ margin: 0, padding: 0, display: "inline-block"}}>Add Message</h3>
        <CloseButton label="x"/>
      </span>
      <form onSubmit={submit}>
          <Select name="layerName">
            <Label>Choose a Layer</Label>
            <Button>
              <SelectValue tabIndex={0}>
                {({ defaultChildren, isPlaceholder }) => {
                  return isPlaceholder ? (
                    <>
                      <b></b>
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
          <p> Location: ( {props.lat.toFixed(5)}, {props.long.toFixed(5)} )</p>
        </div>
        <button {...buttonProps} ref={buttonRef}>
          Post
        </button>
        {isConfirming && <div> Waiting for confirmation... </div>}
        {isConfirmed && <div> Transaction confirmed. </div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </form>
    </>
  );
};
