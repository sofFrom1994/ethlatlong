import "../styles/UserTimeline.css";
import { useContext, useState } from "react";
import {
  Button,
  ColorSwatch,
  Dialog,
  DialogTrigger,
  Modal,
  OverlayTriggerStateContext,
} from "react-aria-components";
import { Config, UseAccountReturnType, useReadContract } from "wagmi";
import { embedType, layerType } from "./types";
import userIcon from "../assets/user-pin.svg";
import { CloseButton } from "./CloseButton";
import { OverlayTriggerState } from "react-stately";
import messageSVG from "../assets/bubble-outline.svg";
import mediaSVG from "../assets/photo.svg";
import layerSVG from "../assets/map.svg";
import goSVG from "../assets/map-pin-up.svg";
import { nToColor } from "../utils";
import { ReadContractErrorType } from "wagmi/actions";

const colorSwatchStyle = {
  borderRadius: "0.2rem",
  height: "90%",
  width: "90%",
};

const Timeline = (props: { author: string; map: L.Map | null, layers : layerType[] }) => {
  if (!props.layers || props.layers.length === 0) return <></>;

  let layerContent: {
    layer: layerType;
    posts: { postType: string; post: layerType | embedType }[];
  }[] = [];

  let empty = true;
  props.layers.forEach((layer) => {
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

  const authorHeader = `${props.author.substring(0, 7)}...${props.author.substring(38,42)}`

  if (empty) {
    const closeButtonStyle = { color: "white" };

    return (
      <Modal isDismissable>
        <Dialog>
          <span>
            <div className="timeline-header">
              <h3>{authorHeader}</h3>
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
    marginTop: "-0.8rem",
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
      <Dialog style={{ paddingTop: "1rem", paddingInline: "0.4rem", height: "90svh", width: "100%" }}>
        {
          <div className="timeline">
            <div className="timeline-header">
              <h3>{authorHeader}</h3>
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
          width="90%"
          height="90%"
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
  } else if (embed.kind === 2) {
    iconSrc = mediaSVG;
  }

  const layerColor = `#${nToColor(layer.color)}`;
  return (
    //<span onClick={() => { setTimeout(() => state.close(), 1600); map?.flyTo([lat, long]); }}>
    <div className="post">
      <div className="post-header">
        <ColorSwatch style={colorSwatchStyle} color={layerColor} />
        <div>{layer.name}</div>
        <img title="embed" width="90%" height="90%" src={iconSrc} alt="embed" />
      </div>
      <div className="post-content">{embed.message}</div>
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
  layers : layerType[];
  error : ReadContractErrorType | null
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!props.account.isConnected) {
    return null;
  }

  let content;

  if (props.error === null) {
    content = <span> "error generating timeline" </span>
  }

  content = (
    <Timeline author={String(props.account.address)} map={props.map} layers={props.layers}/>
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
