import "../styles/UserTimeline.css";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
} from "react-aria-components";
import { Config, UseAccountReturnType, useReadContract } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { embedType, layerType } from "./types";
import { LoadingSpinner } from "./Loading";
import userIcon from "../assets/user-pin.svg";
import { CloseButton } from "./CloseButton";
const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

const closeButtonStyle = {
  marginTop: "-0.7rem",
  marginRight: "-0.4rem",
  marginLeft: "auto",
  width: "fit-content",
  height: "fit-content",
  borderRadius: "1rem",
  color: "white",
};

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
    return (
      <span>
        error {error.name} reading getAllLayers: {error.message}{" "}
      </span>
    );
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!layers || layers.length === 0) return <></>;

  const posts = layers.map((layer) => layerToPost(layer, props.author));

  return (
    <div className="timeline">
      <div className="timeline-header">
        <h3>{props.author.substring(0,7)}...</h3>
        <CloseButton label="x" style={closeButtonStyle}/>
      </div>
      <div className="posts">
        {posts}
      </div>
    </div>
  );
};

const layerPost = (layer: layerType) => {
  return (
    <span>
      {layer.name}
      <br />
      {layer.description}
      {layer.embedN.toString()}
    </span>
  );
};

const embedPost = (embed: embedType, layer: layerType) => {
  return (
    <span>
      {layer.name}
      <br />
      {embed.message}
      {embed.kind}
      {embed.lat.toString()}
      {embed.long.toString()}
    </span>
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
    if (embed.author === author) {
      posts.push({ postType: "embed", post: currEmbed });
    }
  });

  const postView = posts.map((post) => {
    let postEL : JSX.Element;
    if (post.postType === "layer") {
      postEL = layerPost(post.post as layerType);
    } else if (post.postType === "embed") {
      postEL = embedPost(post.post as embedType, layer);
    } else {
      postEL = <></>;
    }
    return <div className="post" onClick={() => console.log("open modal to go to post on map ")}>{postEL}</div>
  });
  return postView;
};

export const UserTimeline = (props: {
  account: UseAccountReturnType<Config>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!props.account.isConnected) {
    return null;
  }
  const content = <Timeline author={String(props.account.address)} />;

  return (
    <>
      <Button
        style={{ borderRadius: "0.9rem", borderColor: "#06B4A5CC" }}
        onPress={() => setIsModalOpen(true)}
      >
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
          <Modal style={{marginTop: "2.5rem", height: "92%", width: "90%"}}isDismissable>
            <Dialog style={{height: "90svh", width: "100%"}}>{content}</Dialog>
          </Modal>
        </DialogTrigger>
      )}
    </>
  );
};
