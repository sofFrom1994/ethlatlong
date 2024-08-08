import { ReactNode, useEffect, useState } from "react";
import { Button, Dialog, DialogTrigger, ListBox, ListBoxItem, Modal } from "react-aria-components";
import { Config, useAccount, UseAccountReturnType, useReadContract } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { embedType, layerType } from "./types";
import { LoadingSpinner } from "./Loading";
import userIcon from "../assets/user-pin.svg";
const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

// todo, instead of reading layers from here, read them from
// a parent component and pass data to all components that need it.

const Timeline = (props: { author: string }) => {
  const [layers, setLayers] = useState<layerType[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // useReadContract within the component render flow
  const {
    data,
    isLoading,
    error: readError,
  } = useReadContract({
    abi,
    address: contract_address,
    functionName: "getAllLayers",
    blockTag: "latest",
    query: {
      refetchInterval: 2000,
      staleTime: Infinity,
    },
  });

  useEffect(() => {
    if (readError) {
      setError(readError);
    } else {
      const uniqueLayers = data ? [...new Set(data)] : [];
      setLayers(uniqueLayers);
    }
  }, [data, readError]);

  if (error) {
    console.log(error);
    return <></>;
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!layers || layers.length === 0) return <></>;

  const posts = layers.map((layer) => layerToPost(layer, props.author))

  return (
    <>
      {posts}
    </>
  );
};

// each post has a button to show it on the map. maybe the modal should be on the map to the left

const layerToPost = (layer: layerType, author: string) => {
  let posts: { postType: string; post: layerType | embedType }[] = [];
  if (layer.author === author) {
    posts.push({ postType: "layer", post: layer });
  }

  layer.embeds.forEach((embed) => {
    const currEmbed = embed;
    console.log(embed);
    console.log(embed.author);
    console.log(author);
    if (embed.author === author) {
      console.log("same");
      posts.push({ postType: "embed", post: currEmbed });
    }
  });

  console.log("posts: ", posts)

  const postView = posts.map(post => {
    if (post.postType === "layer" ) {
      let layerPost = post.post as layerType;
      return <>
        {layerPost.name}
      <br />
        {layerPost.description}
        {layerPost.embedN.toString()}
      <br />
      </>
    } else if (post.postType === "embed" ) {
      let embedPost = post.post as embedType;
      return <>
        {layer.name}
      <br />
        {embedPost.message}
        {embedPost.kind}
        {embedPost.lat.toString()}
        {embedPost.long.toString()}
      <br />
      </>
    } else {
      return <></>
    }
  })
  return postView
}
  

export const UserTimeline = (props: {account : UseAccountReturnType<Config> }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  let content: ReactNode;
  if (!props.account.isConnected) {
    return null
  }
  content = <Timeline author={String(props.account.address)} />;

  return (
    <>
      <Button style={{ borderRadius: "0.9rem", borderColor: "#06B4A5CC"   }} onPress={() => setIsModalOpen(true)}>
        <span>
          <img
            width="inherit"
            height="inherit"
            src={userIcon}
            alt="user timeline"
          />
        </span>
      </Button>
      {content && (
        <DialogTrigger isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <Modal style={{width: "84svw"}}isDismissable>
            <Dialog>{content}</Dialog>
          </Modal>
        </DialogTrigger>
      )}
    </>
  );
};
