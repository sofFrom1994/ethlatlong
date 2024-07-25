import React from "react";

import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  type Selection,
} from "react-aria-components";
import { markerFilter } from "./types";
import filterI from "../assets/filter.svg";

const defaultMarkerFilter: markerFilter = {
  message: false,
  media: false,
  path: false,
  cast: false,
};

const selectionToMarkerFilter = (
  selection: string | string[] | Set<string>
): markerFilter => {
  const filter: markerFilter = { ...defaultMarkerFilter };

  if (typeof selection === "string") {
    if (selection.includes(",")) {
      selection = selection.split(",");
    } else {
      selection = [selection];
    }
  } else if (selection instanceof Set) {
    selection = Array.from(selection);
  }

  selection.forEach((item) => {
    switch (item) {
      case "message":
        filter.message = true;
        break;
      case "media":
        filter.media = true;
        break;
      case "path":
        filter.path = true;
        break;
      case "cast":
        filter.cast = true;
        break;
      default:
        console.warn(`Unknown selection: ${item}`);
    }
  });

  return filter;
};

// todo: use setFilters from map.
// then, using filter on map pass it to layer choice to
// only display markers of the right kind
const Filter = (_filterSetter: any) => {
  return (
    <p className="filter">
      <img src={filterI} alt="" />
      Filter
    </p>
  );
};

export const FilterMenu = (filterSetter: any) => {
  let [selected, setSelected] = React.useState<Selection>(
    new Set([])
  );

  const handleSelectionChange = (newSelection: Selection) => {
    setSelected(newSelection);
    const filter = selectionToMarkerFilter(newSelection);
    filterSetter(filter);
  };

  return (
    <MenuTrigger>
      <Button aria-label="Filter Menu">
        <p className="filter">
          <img src={filterI} alt="" />
          Filter
        </p>
      </Button>
      <Popover>
        <Menu
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={handleSelectionChange}
        >
          <MenuItem id="message"> Message </MenuItem>
          <MenuItem id="media"> Media </MenuItem>
          <MenuItem isDisabled id="cast">
            Cast
          </MenuItem>
          <MenuItem isDisabled id="path">
            Path
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
