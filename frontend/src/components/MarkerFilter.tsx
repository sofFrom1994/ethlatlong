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
  selection: Set<string>
): markerFilter => {
  const filter: markerFilter = { ...defaultMarkerFilter };

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

export const FilterMenu = ({ filterSetter }: { filterSetter: (filter: markerFilter) => void }) => {
  let [selected, setSelected] = React.useState<Selection>(
    new Set(["message", "media"])
  );

  const handleSelectionChange = (newSelection: Selection) => {
    // Convert Selection to Set<string>
    const stringSet = new Set<string>(Array.from(newSelection as Set<string>));
    setSelected(stringSet);
    const filter = selectionToMarkerFilter(stringSet);
    filterSetter(filter);
  };

  return (
    <MenuTrigger>
      <Button aria-label="Filter Menu">
        <p className="filter">
          <img width="inherit" height="inherit" src={filterI} alt="filter content" />
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