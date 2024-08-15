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
import layerIcon from "../assets/map.svg?raw"
import { coloredSVG } from "../utils";

const legend = () => {
  return (
    <DialogTrigger>
      <Button className="footer-button" aria-label="">Legend</Button>
      <Popover style={{ paddingBottom: "2.5rem", width: "10rem", height: "13rem", zIndex: 240000001 }}>
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
              <h3> Messages  </h3>
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
      <Modal isDismissable>
        <Dialog>
          <Heading slot="title">roadmap</Heading>
          <ul className="roadmap">
            <li> some element</li>
            <li> some element</li>
            <li> some element</li>
            <li> some element</li>
          </ul>
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
      <Modal isDismissable>
        <Dialog>
          <Heading slot="title">about</Heading>
          about
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
