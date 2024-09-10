import {
  Button,
  ColorSwatch,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { layerType } from "./types";
import { nToColor } from "../utils";

const colorSwatchStyle = {
  borderRadius: "0.2rem",
  height: "2rem",
  width: "2rem",
};

const layersToListBoxes = (layers: layerType[]) => {
  return layers.map((layer) => {
    return (
      <ListBoxItem key={layer.name} id={layer.name}>
        <div className="layer-select-header">
          <ColorSwatch
            style={colorSwatchStyle}
            color={`#${nToColor(layer.color)}`}
          />
          {layer.name}
        </div>
      </ListBoxItem>
    );
  });
};

export const SelectLayer = (layers: layerType[], name: string) => {
  const layerListBoxes = layersToListBoxes(layers);
  return (
    <Select name={name}>
      <Label>Choose a Layer</Label>
      <Button>
        <SelectValue tabIndex={0}>
          {({ defaultChildren, isPlaceholder }) => {
            return isPlaceholder ? (
              <>
                <b></b>
              </>
            ) : (
              defaultChildren
            );
          }}
        </SelectValue>
        <span aria-hidden="true">▼</span>
      </Button>
      <Popover style={{ zIndex: 2147483647 }}>
        <ListBox>{layerListBoxes}</ListBox>
      </Popover>
    </Select>
  );
};
