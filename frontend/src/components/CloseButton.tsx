import { useContext } from "react";
import { Button, OverlayTriggerStateContext } from "react-aria-components";

export function CloseButton() {
  let state = useContext(OverlayTriggerStateContext)!;
  return (
    <Button
      className="dummy"
      style={{
        marginTop: "-0.6rem", 
        marginRight: "-0.6rem",
        marginLeft: "auto", 
        width: "fit-content",
        height: "fit-content",
        borderRadius: "1rem",
        color: "white !important"
      }}
      onPress={() => state.close()}
    >x</Button>
  );
}