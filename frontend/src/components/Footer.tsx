import { DialogTrigger, Button, Popover, OverlayArrow, Dialog, Heading } from "react-aria-components"
import "../styles/Footer.css"

const infoPopover = (buttonLabel : string, title : string, descrition : string) => {
  return (

<DialogTrigger>
  <Button aria-label="">{buttonLabel}</Button>
  <Popover>
    <OverlayArrow>
      <svg width={12} height={12} viewBox="0 0 12 12">
        <path d="M0 0 L6 6 L12 0" />
      </svg>
    </OverlayArrow>
    <Dialog>
      <Heading slot="title">{title}</Heading>
      <p>{descrition}</p>
    </Dialog>
  </Popover>
</DialogTrigger>
  )
}

export const Footer = () => {
  return (
        <footer>
          {infoPopover ("About", "About", "about")}
          {infoPopover ("Legend", "Legend", "about")}
          {infoPopover ("Roadmap", "Roadmap", "roadmap")}
        </footer>
)
}
