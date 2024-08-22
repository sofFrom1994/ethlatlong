import "../styles/react-aria.css";
import "../styles/AddMedia.css"

import { ethLatLongAbi } from "../generated";
import { useRef } from "react";
import { useButton } from "@react-aria/button";
import {
  BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseLatLong } from "../utils";
import {
  Button,
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

/*
[
   
    {
        "image": {
            "cachedUrl": "https://nft-cdn.alchemy.com/base-sepolia/bc169b94d35620157784253363dbcb7b",
            "thumbnailUrl": "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/base-sepolia/bc169b94d35620157784253363dbcb7b",
            "pngUrl": "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/base-sepolia/bc169b94d35620157784253363dbcb7b",
            "contentType": "image/png",
            "size": 15459,
            "originalUrl": "https://ipfs.io/ipfs/bafybeigwyq2mc4smvyn3tsmodf2a7yhexvbsm4ryg7ntvlup2knfaqlhhu"
        },
        "raw": {
            "tokenUri": "data:application/json;base64,eyJuYW1lIjoidGVzIHQgbmZ0IDEgIzEiLCJpbWFnZSI6ImlwZnM6Ly9iYWZ5YmVpZ3d5cTJtYzRzbXZ5bjN0c21vZGYyYTd5aGV4dmJzbTRyeWc3bnR2bHVwMmtuZmFxbGhodSJ9",
            "metadata": {
                "image": "ipfs://bafybeigwyq2mc4smvyn3tsmodf2a7yhexvbsm4ryg7ntvlup2knfaqlhhu"
            }
        },
]
*/

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;
const serverURL = import.meta.env.VITE_SERVER_URL;
const getNFTsURL = "getAddressNFTs?address=";

const nftView = (
  nft: any,
  onSelectNFT: (contractAddress: string, tokenId: string) => void,
  selectedNFT: {
    contractAddress: string;
    tokenId: string;
} | null
) => {

  let styles = {}; 
  if (nft.contract.address === selectedNFT?.contractAddress && nft.tokenId === selectedNFT?.tokenId) {
    styles = {backgroundColor: "black"};
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
  onSelectNFT: (contractAddress: string, tokenId: string) => void,
  selectedNFT: {
    contractAddress: string;
    tokenId: string;
} | null
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

  const nftViews = data.map((nft: any) => nftView(nft, props.onSelectNFT, props.selectedNFT));

  return <div className="owned-nfts">{nftViews}</div>;
};

export const AddMediaForm = (props: {
  lat: number;
  long: number;
  address: string;
  layers: layerType[];
  error: ReadContractErrorType | null;
}) => {
  const [selectedNFT, setSelectedNFT] = useState<{
    contractAddress: string;
    tokenId: string;
  } | null>(null);
  const { writeContract, data: hash, isPending, error } = useWriteContract();
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
        {layer.name}
      </ListBoxItem>
    );
  });

  return (
    <div style={{overflow: "auto"}}>
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

        <div style={{overflow: "auto"}}>
          <label htmlFor="Message">Choose media to embed:</label>
          <OwnedNFTs address={props.address} selectedNFT={selectedNFT} onSelectNFT={handleSelectNFT} />
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
