import filterI from "../assets/filter.svg";

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

const filterToSelectionSet = (filter: markerFilter): Set<string> => {
  return new Set(
    Object.keys(filter).filter((key) => filter[key as keyof markerFilter])
  );
};

const selectionToMarkerFilter = (selection: Set<string>): markerFilter => {
  const filter: markerFilter = {
    message: false,
    media: false,
    path: false,
    cast: false,
  };
  selection.forEach((item) => {
    filter[item as keyof markerFilter] = true;
  });
  return filter;
};

export const FilterMenu = ({
  filterSetter,
  initialFilter,
}: {
  filterSetter: (filter: markerFilter) => void;
  initialFilter: markerFilter;
}) => {
  let [selected, setSelected] = React.useState<Selection>(
    filterToSelectionSet(initialFilter)
  );

  const handleSelectionChange = (newSelection: Selection) => {
    const stringSet = new Set<string>(Array.from(newSelection as Set<string>));
    setSelected(stringSet);
    const filter = selectionToMarkerFilter(stringSet);
    filterSetter(filter);
  };

  return (
    <MenuTrigger>
      <Button aria-label="Filter Menu">
        <p className="filter">
          <img
            width="inherit"
            height="inherit"
            src={filterI}
            alt="filter content"
          />
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
