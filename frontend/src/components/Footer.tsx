import {
  DialogTrigger,
  Button,
  Popover,
  OverlayArrow,
  Dialog,
  Heading,
  Modal,
} from "react-aria-components";
import "../styles/Footer.css";

import messageIcon from "../assets/message.svg?raw";
import mediaIcon from "../assets/photo-outline.svg?raw";
import castIcon from "../assets/purple-white.svg?raw";
import layerIcon from "../assets/map.svg?raw";
import { coloredSVG } from "../utils";

const legend = () => {
  return (
    <DialogTrigger>
      <Button className="footer-button" aria-label="">
        Legend
      </Button>
      <Popover
        style={{
          paddingBottom: "2.5rem",
          width: "10rem",
          height: "13rem",
          zIndex: 240000001,
        }}
      >
        <OverlayArrow>
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog>
          <h2> Legend </h2>
          <div className="legend">
            <div className="legend-symbol">
              {coloredSVG("#FFFFFF", messageIcon)}
              <h3> Messages </h3>
            </div>
            <div className="legend-symbol">
              {coloredSVG("#FFFFFF", mediaIcon)}
              <h3> Media </h3>
            </div>
            <div className="legend-symbol">
              {coloredSVG("none", castIcon)}
              <h3> Casts </h3>
            </div>
            <div className="legend-symbol">
              {coloredSVG("#FFFFFF", layerIcon)}
              <h3> Layers </h3>
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
        style={{ maxHeight: "60svh", maxWidth: "90svw" , overflowY: "auto", paddingInline: "0rem" }}
        isDismissable
      >
        <Dialog>
          <h2>Roadmap</h2>
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
              <li> 3D media embed( add orientation ) (ar related / pokemon go inspired) </li>
              <li> custom maps (areas, image overlays) </li>
            </ul>
            <h3> Improvements </h3>
            <ul className="roadmap-list">
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
      <Modal style={{ maxHeight: "60svh", maxWidth: "90svw" , overflowY: "auto", paddingInline: "0rem" }} isDismissable>
        <Dialog>
          <h2 slot="title">About</h2>
          <span className="about">
            <span>
              A geographical information layer for ethereum on Base. Explore the
              world through user-created layers of messages, media, casts,
              paths.
              <span>
                Built with leaflet, open street map, WAGMI, hardhat, react-aria,
                rainbow and vite.
              </span>
              <span>todo: add links to about or footer-footer</span>
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
