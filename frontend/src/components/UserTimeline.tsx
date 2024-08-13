import "../styles/UserTimeline.css";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  ColorSwatch,
  Dialog,
  DialogTrigger,
  Modal,
  OverlayTriggerStateContext,
} from "react-aria-components";
import { Config, UseAccountReturnType, useReadContract } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { embedType, layerType } from "./types";
import { LoadingSpinner } from "./Loading";
import userIcon from "../assets/user-pin.svg";
import { CloseButton } from "./CloseButton";
import { OverlayTriggerState } from "react-stately";
import messageSVG from "../assets/message.svg";
import mediaSVG from "../assets/photo.svg";
import layerSVG from "../assets/map.svg";
import goSVG from "../assets/map-pin-up.svg";
import { nToColor } from "../utils";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

const colorSwatchStyle = {
  borderRadius: "0.2rem",
  height: "90%",
  width: "90%",
};

const Timeline = (props: { author: string; map: L.Map | null }) => {
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

  let layerContent: {
    layer: layerType;
    posts: { postType: string; post: layerType | embedType }[];
  }[] = [];

  let empty = true;
  layers.forEach((layer) => {
    let currLayer = layer;
    let posts: { postType: string; post: layerType | embedType }[] = [];

    if (layer.author === props.author) {
      posts.push({ postType: "layer", post: layer });
      empty = false;
    }

    layer.embeds.forEach((embed) => {
      const currEmbed = embed;
      if (embed.author === props.author) {
        posts.push({ postType: "embed", post: currEmbed });
        empty = false;
      }
    });

    layerContent.push({ layer: currLayer, posts });
  });

  if (empty) {
    const closeButtonStyle = { color: "white" };

    return (
      <Modal isDismissable>
        <Dialog>
          <span>
            <div className="timeline-header">
              <h3>{props.author.substring(0, 7)}...</h3>
            </div>
            Your timeline is empty.
            <CloseButton label="Close" style={closeButtonStyle} />
          </span>
        </Dialog>
      </Modal>
    );
  }

  const postviews = contentToPostView(layerContent, props.map);

  const closeButtonStyle = {
    marginTop: "-0.7rem",
    marginRight: "-0.4rem",
    marginLeft: "auto",
    width: "fit-content",
    height: "fit-content",
    borderRadius: "1rem",
    color: "white",
  };

  return (
    <Modal
      style={{ marginTop: "2.5rem", height: "92%", width: "90%" }}
      isDismissable
    >
      <Dialog style={{ height: "90svh", width: "100%" }}>
        {
          <div className="timeline">
            <div className="timeline-header">
              <h3>{props.author.substring(0, 7)}...</h3>
              <CloseButton label="x" style={closeButtonStyle} />
            </div>
            <div className="posts">{postviews}</div>
          </div>
        }
      </Dialog>
    </Modal>
  );
};

const layerPost = (layer: layerType) => {
  const layerColor = `#${nToColor(layer.color)}`;
  return (
    <div className="post">
      <div className="post-header">
        <ColorSwatch style={colorSwatchStyle} color={layerColor} />
        <div>{layer.name}</div>
        <img
          title="layer embed"
          width="auto"
          height="auto"
          src={layerSVG}
          alt="message embed"
        />
      </div>
      <div className="post-content">
        {layer.description}
        {layer.embedN.toString()}
      </div>
    </div>
  );
};

const embedPost = (
  embed: embedType,
  layer: layerType,
  map: L.Map | null,
  state: OverlayTriggerState
) => {
  const lat = Number(embed.lat) / 1e18;
  const long = Number(embed.long) / 1e18;

  let iconSrc;

  if (embed.kind === 0) {
    iconSrc = messageSVG;
  } else if (embed.kind === 1) {
    iconSrc = mediaSVG;
  }

  const layerColor = `#${nToColor(layer.color)}`;
  return (
    //<span onClick={() => { setTimeout(() => state.close(), 1600); map?.flyTo([lat, long]); }}>
    <div className="post">
      <div className="post-header">
        <ColorSwatch style={colorSwatchStyle} color={layerColor} />
        <div>{layer.name}</div>
        <img
          title="embed"
          width="auto"
          height="auto"
          src={messageSVG}
          alt="embed"
        />
      </div>
      <div className="post-content">{embed.message}</div>
      <div className="post-footer">
        <img
          onClick={() => {
            state.close();
            map?.flyTo([lat, long], 18);
          }}
          width="auto"
          height="auto"
          src={goSVG}
          alt="go to embed"
        />
        <div>{/*<div style={{ color: "red"}}> Delete </div>*/}</div>
      </div>
    </div>
  );
};

const contentToPostView = (
  content: {
    layer: layerType;
    posts: { postType: string; post: layerType | embedType }[];
  }[],
  map: L.Map | null
) => {
  let state = useContext(OverlayTriggerStateContext)!;
  const postViews = content.map((postView) => {
    return postView.posts.map((post) => {
      let postEL: JSX.Element;
      if (post.postType === "layer") {
        postEL = layerPost(post.post as layerType);
      } else if (post.postType === "embed") {
        postEL = embedPost(post.post as embedType, postView.layer, map, state);
      } else {
        postEL = <></>;
      }
      return postEL;
    });
  });

  return postViews;
};

export const UserTimeline = (props: {
  account: UseAccountReturnType<Config>;
  map: L.Map | null;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!props.account.isConnected) {
    return null;
  }
  const content = (
    <Timeline author={String(props.account.address)} map={props.map} />
  );

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
          {content}
        </DialogTrigger>
      )}
    </>
  );
};
