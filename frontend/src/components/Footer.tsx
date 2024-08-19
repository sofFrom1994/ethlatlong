import {
  DialogTrigger,
  Button,
  Popover,
  OverlayArrow,
  Dialog,
  Modal,
} from "react-aria-components";
import "../styles/Footer.css";

import castIcon from "../assets/purple-white.svg";
import leafletIcon from "../assets/Leaflet_logo.png";
import wagmiIcon from "../assets/wagmi.svg";
import hardhatIcon from "../assets/hardhat-logo-dark.svg";
import raIcon from "../assets/react_aria.png";
import rainbowIcon from "../assets/rainbow.svg";
import osmIcon from "../assets/osm.png";
import gitIcon from "../assets/github.png";
import twitterIcon from "../assets/x-black.png";

import filterIcon from "../assets/filter.svg?raw"
import leafletLayerIcon from "../assets/layers.png"

import messageIconRaw from "../assets/message.svg?raw";
import mediaIconRaw from "../assets/photo-outline.svg?raw";
import castIconRaw from "../assets/purple-white.svg?raw";
import layerIconRaw from "../assets/map.svg?raw";
import { coloredSVG } from "../utils";
import { CloseButton } from "./CloseButton";

const legend = () => {
  return (
    <DialogTrigger>
      <Button className="footer-button" aria-label="">
        Guide
      </Button>
      <Popover
        style={{
          width: "24rem",
          paddingInline: "0.5rem",
          zIndex: 240000001,
        }}
      >
        <OverlayArrow>
          <svg width={"4rem"} height={"2rem"} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog style={{overflowY: "auto"}}>
          <h2> Guide </h2>
          <h3> Embeds </h3>
          <p>
            {" "}
            Embeds are onchain objects with a location on the map and a
            particular layer. Click on them to see more, double click on them to
            zoom to them. To add an embed click the + button and choose the embed kind and location.
          </p>
          <div className="guide-symbols">
            <div className="guide-symbol">
              {coloredSVG("#FFFFFF", messageIconRaw)}
              <p> Messages </p>
            </div>
            <div className="guide-symbol">
              {coloredSVG("#FFFFFF", mediaIconRaw)}
              <p> Media </p>
            </div>
            <div className="guide-symbol">
              {coloredSVG("none", castIconRaw)}
              <p> Casts </p>
            </div>
            <div className="guide-symbol">
              {coloredSVG("#FFFFFF", layerIconRaw)}
              <p> Layers </p>
            </div>
            </div>
            
  <h3> Layers and Filters </h3>
          <p>
            To make the map more manageable you can choose which layers to see on the top right and filter which kinds of
            embeds to see with the filter button.
          </p>
            <div className="guide-symbols">
              <div className="guide-symbol">
                {coloredSVG("#FFFFFF", filterIcon)}
                <p> Filter </p>
              </div>
              <div className="guide-symbol">
                <img src={leafletLayerIcon} alt="HTML tutorial"
                  height={"auto"}
                  width={"auto"}
                  />
                <p> Layers </p>
              </div>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};

const roadmap = () => {
  return (
    <DialogTrigger>
      <Button className="footer-button" aria-label="">
        Roadmap{" "}
      </Button>
      <Modal
        style={{
          maxHeight: "71svh",
          maxWidth: "90svw",
          overflowY: "auto",
          paddingInline: "0rem",
          marginBottom: "8rem",
        }}
        isDismissable
      >
        <Dialog>
          <span
            style={{
              height: "1rem",
              marginBottom: "1.5rem",
              display: "grid",
              gridTemplateColumns: "1fr auto",
            }}
          >
            <h2>Roadmap</h2>
            <CloseButton label="x" />
          </span>
          <span className="roadmap">
            <h3> Future features </h3>
            <ul className="roadmap-list">
              <li> Embed media UI. </li>
              <li> Farcaster integration </li>
              <li>
                {" "}
                Post paths created by using real time watch mode: for drawing a
                path, enable watch on the map when the path starts and record
                the starting location. As the user moves take snapshots (for
                anything from determining the path points to speed or whatever),
                until the user hits stop or the limit is reached. Make a list of
                the points and order from start to end. This is the path.{" "}
              </li>
              <li> Gasless messages via zora minting </li>
              <li> Permissioned (write controlled ) layers </li>
              <li>
                {" "}
                3D media embed( add orientation ) (ar related / pokemon go
                inspired){" "}
              </li>
              <li> custom maps (areas, image overlays) </li>
            </ul>
            <h3> Improvements </h3>
            <ul className="roadmap-list">
              <li> Area based marker clusters </li>
              <li> Use events to add a time component to all posts </li>
              <li> layer categories / search </li>
            </ul>
          </span>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};

const about = () => {
  return (
    <DialogTrigger>
      <Button className="footer-button" aria-label="">
        About
      </Button>
      <Modal
        style={{
          marginBottom: "8rem",
          maxHeight: "73svh",
          maxWidth: "91svw",
          overflowY: "auto",
        }}
        isDismissable
      >
        <Dialog>
          <span
            style={{
              height: "1rem",
              marginBottom: "1.5rem",
              display: "grid",
              gridTemplateColumns: "1fr auto",
            }}
          >
            <h2 slot="title">About</h2>
            <CloseButton label="x" />
          </span>
          <span className="about">
            <span>
              <span>
                A geographical information layer for ethereum on Base. Explore
                the world through user-created layers of messages, media, casts,
                paths. Embed onchain items in the "physical" world. The main
                inspiration for this project was a summer and a half of pokemon
                go in 2015-16 that first showed me what could be possible by
                embedding the digital onto the physical.
              </span>
              <h3> Current state</h3>
              <span>
                The project is between the tech demo and alpha stages. It is
                active development, and will remain public and seeking feedback
                and more from this stage on. If interested in feedback,
                collaboration, or anything at all, please reach out on any of
                our links below.
              </span>
              <h3> Built with </h3>
              <span className="built-with-links">
                <a href="https://leafletjs.com/">
                  <img src={leafletIcon} alt="HTML tutorial" />
                </a>
                <a href="https://wagmi.sh/">
                  <img src={wagmiIcon} alt="HTML tutorial" />
                </a>
                <a href="https://hardhat.org">
                  <img src={hardhatIcon} alt="HTML tutorial" />
                </a>
                <a href="https://react-spectrum.adobe.com/react-aria">
                  <img src={raIcon} alt="HTML tutorial" />
                </a>
                <a href=" https://www.openstreetmap.org">
                  <img src={osmIcon} alt="HTML tutorial" />
                </a>
                <a href="https://www.rainbowkit.com">
                  <img src={rainbowIcon} alt="HTML tutorial" />
                </a>
              </span>
            </span>
            <h3> Links </h3>
            <span className="app-links">
              <a href="https://www.uarehere.online">
                <img
                  src={castIcon}
                  alt="HTML tutorial"
                  height={"auto"}
                  width={"40rem"}
                />
              </a>
              <a href="https://x.com/u_are_here_app">
                <img src={twitterIcon} alt="HTML tutorial" />{" "}
              </a>
              <a href="https://github.com/sofFrom1994/ethlatlong">
                <img src={gitIcon} alt="HTML tutorial" />
              </a>
            </span>
          </span>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};

export const Footer = () => {
  return (
    <footer>
      {legend()}
      {about()}
      {roadmap()}
    </footer>
  );
};
