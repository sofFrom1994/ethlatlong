import filterI from "../assets/filter.svg";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  OverlayArrow,
  Popover,
  type Selection,
} from "react-aria-components";
import { markerFilter } from "./types";
import { TimeSlider } from "./RangeSlider";

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
  dateRange, 
  setDateRange
}: {
  filterSetter: (filter: markerFilter) => void;
  initialFilter: markerFilter;
  dateRange: number[];
  setDateRange: Dispatch<SetStateAction<number[]>>
}) => {
  let [selected, setSelected] = useState<Selection>(
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
          <img width={24} height={24} src={filterI} alt="filter content" />
          Filter
        </p>
      </Button>
      <Popover
        style={{
          paddingBlock: "1rem",
          paddingInline: "1rem",
        }}
      >
        <OverlayArrow>
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
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
        <TimeSlider value={dateRange} setValue={setDateRange}/>
      </Popover>
    </MenuTrigger>
  );
};
