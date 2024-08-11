import { useContext } from "react";
import { Button, OverlayTriggerStateContext } from "react-aria-components";

export function CloseButton(props : {label : string}) {
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
        color: "white"
      }}
      onPress={() => state.close()}
    >{props.label}</Button>
  );
}