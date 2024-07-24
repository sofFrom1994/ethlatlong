import { DialogTrigger, Button, Popover, OverlayArrow, Dialog, Heading } from "react-aria-components"
import "../styles/Footer.css"
import { ReactElement, ReactNode } from "react"

import messageIcon from "../assets/bubble.svg"
import mediaIcon from "../assets/photo.svg"
import castIcon from "../assets/purple-white.svg"

const infoPopover = (buttonLabel : string, title : string, content : ReactNode) => {
  return (

<DialogTrigger>
  <Button className="footer-button" aria-label="">{buttonLabel}</Button>
  <Popover style={{zIndex: 240000001}}>
    <OverlayArrow>
      <svg width={12} height={12} viewBox="0 0 12 12">
        <path d="M0 0 L6 6 L12 0" />
      </svg>
    </OverlayArrow>
    <Dialog>
      <Heading slot="title">{title}</Heading>
      {content}
    </Dialog>
  </Popover>
</DialogTrigger>
  )
}

const roadmap = () => {
  const roadmap = () => {
    return (
      <ul className="roadmap">
        <li> some element</li>
        <li> some element</li>
        <li> some element</li>
        <li> some element</li>
      </ul>
    )
  }

  return infoPopover("Roadmap", "Roadmap", roadmap())
}

const legend = () => {
  const legend = () => {
    return (
      <div className="legend">
        <div className="legend-symbol"><img src={messageIcon} alt="" />Messages</div>
        <div className="legend-symbol"><img src={mediaIcon} alt="" />Media</div>
        <div className="legend-symbol"><img src={castIcon} alt="" />Casts</div>
      </div>
    );
  };
  return infoPopover("Legend", "Legend", legend());
};

export const Footer = () => {
  return (
        <footer>
          {infoPopover ("About", "About", "lengthy description about the app")}
          {legend()}
          {roadmap()}
        </footer>
)
}
