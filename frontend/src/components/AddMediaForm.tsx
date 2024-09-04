import "../styles/react-aria.css";
import "../styles/AddMedia.css";
import "../AddForm.css";

import { ethLatLongAbi } from "../generated";
import { useRef } from "react";
import { useButton } from "@react-aria/button";
import {
  BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { nToColor, parseLatLong } from "../utils";
import {
  Button,
  ColorSwatch,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { layerType } from "./types";
import { ReadContractErrorType } from "wagmi/actions";
import { CloseButton } from "./CloseButton";
import { useQuery } from "@tanstack/react-query";

import { useState } from "react";

const serverURL = import.meta.env.VITE_SERVER_URL;
const getNFTsURL = "getAddressNFTs?address=";

const colorSwatchStyle = {
  borderRadius: "0.2rem",
  height: "2rem",
  width: "2rem",
};

const nftView = (
  nft: any,
  onSelectNFT: (contractAddress: string, tokenId: string) => void,
  selectedNFT: {
    contractAddress: string;
    tokenId: string;
  } | null
) => {
  let styles = {};
  if (
    nft.contract.address === selectedNFT?.contractAddress &&
    nft.tokenId === selectedNFT?.tokenId
  ) {
    styles = { backgroundColor: "black" };
  }
  return (
    <div
      className="nft"
      style={styles}
      onClick={() => onSelectNFT(nft.contract.address, nft.tokenId)}
    >
      <p> name: {nft.name} </p>
      <p> contract: {nft.contract.name} </p>
      <p> {nft.tokenId} </p>
      <p> {nft.tokenType} </p>
      <p> {nft.name} </p>
      {nft.image && (
        <img
          width="48px"
          height="48px"
          loading="lazy"
          src={nft.image.thumbnailUrl}
          alt={nft.name}
        />
      )}
    </div>
  );
};

const OwnedNFTs = (props: {
  address: string;
  onSelectNFT: (contractAddress: string, tokenId: string) => void;
  selectedNFT: {
    contractAddress: string;
    tokenId: string;
  } | null;
}) => {
  const reqURL = serverURL + getNFTsURL + props.address;
  const { isLoading, error, data } = useQuery({
    queryKey: ["getAddressNFTs", props.address],
    queryFn: async () => {
      const res = await fetch(reqURL);
      return res.json();
    },
  });
  if (isLoading) return "Loading...";

  if (error) return <span> An error has occurred: {error.message} </span>;

  const nftViews = data.map((nft: any) =>
    nftView(nft, props.onSelectNFT, props.selectedNFT)
  );

  return <div className="owned-nfts">{nftViews}</div>;
};

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

export const AddMediaForm = (props: {
  lat: number;
  long: number;
  address: string;
  layers: layerType[];
  error: ReadContractErrorType | null;
  refetch;
}) => {
  const [selectedNFT, setSelectedNFT] = useState<{
    contractAddress: string;
    tokenId: string;
  } | null>(null);
  const {
    writeContract,
    data: hash,
    isPending,
    error,
    status,
  } = useWriteContract();
  const buttonRef = useRef(null);

  const handleSelectNFT = (contractAddress: string, tokenId: string) => {
    setSelectedNFT({ contractAddress, tokenId });
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedNFT) {
      alert("Please select an NFT");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const layerName = formData.get("layerName") as string;
    const message = formData.get("message") as string;

    console.log([
      layerName,
      parseLatLong(props.lat.toString()),
      parseLatLong(props.long.toString()),
      message,
      selectedNFT.contractAddress,
      selectedNFT.tokenId,
    ]);
    writeContract({
      address: contract_address,
      abi,
      functionName: "addMedia",
      args: [
        selectedNFT.contractAddress as `0x${string}`,
        BigInt(selectedNFT.tokenId),
        parseLatLong(props.lat.toString()),
        parseLatLong(props.long.toString()),
        layerName,
        message,
      ],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const { buttonProps } = useButton(
    {
      isDisabled: isPending,
      type: "submit",
    },
    buttonRef
  );

  const layerListBoxes = props.layers.map((layer) => {
    return (
      <ListBoxItem key={layer.name} id={layer.name}>
        {" "}
        <div className="layer-select-header">
          {" "}
          <ColorSwatch
            style={colorSwatchStyle}
            color={`#${nToColor(layer.color)}`}
          />{" "}
          {layer.name}{" "}
        </div>
      </ListBoxItem>
    );
  });

  if (status === "success") {
    props.refetch();
  }

  return (
    <div>
      <span
        style={{
          height: "1rem",
          marginBottom: "1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr auto",
        }}
      >
        <h3 style={{ margin: 0, padding: 0, display: "inline-block" }}>
          Add Media
        </h3>
        <CloseButton label="x" />
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
          <Popover style={{ zIndex: 2147483647 }}>
            <ListBox>{layerListBoxes}</ListBox>
          </Popover>
        </Select>

        <div>
          <label htmlFor="Message">Choose media to embed:</label>
          <OwnedNFTs
            address={props.address}
            selectedNFT={selectedNFT}
            onSelectNFT={handleSelectNFT}
          />
        </div>

        <div>
          <p>
            {" "}
            Location: ( {props.lat.toFixed(5)}, {props.long.toFixed(5)} )
          </p>
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
    </div>
  );
};
