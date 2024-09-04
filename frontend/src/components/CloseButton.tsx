import { useContext } from "react";
import { Button, OverlayTriggerStateContext } from "react-aria-components";

const defaultStyle: React.CSSProperties = {
  marginTop: "-0.6rem",
  marginRight: "-0.6rem",
  marginLeft: "auto",
  width: "fit-content",
  height: "fit-content",
  borderRadius: "1rem",
  color: "white",
};

export function CloseButton({ label = "x", style = defaultStyle }) {
  let state = useContext(OverlayTriggerStateContext)!;
  return (
    <Button className="dummy" style={style} onPress={() => state.close()}>
      {label}
    </Button>
  );
}
