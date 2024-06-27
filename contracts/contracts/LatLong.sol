// SPDX-License-Identifier: UNKNOWN 
pragma solidity ^0.8.24;

import { SD59x18, sd } from "@prb/math/src/SD59x18.sol";

contract LatLong {
  enum Kinds { message, path, media }

  struct Embed {
    uint id;
    Kinds kind;
    address embedAddress; // url in case of media
    string message;
  }

  struct Location {
    // 6 decimal places (e.g., 38.900000, -77.000000) gives a precision of about 0.11 meters (11 centimeters).
    SD59x18 long; // [-180, 180]
    SD59x18 lat; // [-90, 90]
  }

  struct Layer {
    uint id;
    string name;
    mapping(uint => Embed) embeds; // embed id to embed
  }

  mapping (string => Layer ) layers;

  // add message at place
  function addMessage(string calldata message, string calldata layer, SD59x18 lat, SD59x18 long) public {
  }

  // place object at place
  function placeObject(Embed calldata embed, string calldata layer, SD59x18 lat, SD59x18 long) public {
  }
}