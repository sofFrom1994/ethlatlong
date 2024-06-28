// SPDX-License-Identifier: UNKNOWN 
pragma solidity ^0.8.24;

import { SD59x18, sd } from "@prb/math/src/SD59x18.sol";

contract EthLatLong {
  enum Kinds { Message, Path, Media }

  struct Embed {
    uint id;
    Kinds kind;
    string message;
    Location location;
  }

  struct Location {
    // 6 decimal places (e.g., 38.900000, -77.000000) gives a precision of about 0.11 meters (11 centimeters).
    SD59x18 long; // [-180, 180]
    SD59x18 lat; // [-90, 90]
  }

  struct Layer {
    string name;
    string description;
    // maybe owner / have a permissioned layer
    uint embedN;
    Embed[] embeds;
    Location startingLoc;
  }

  //constants
  // min lat, min long, max lat, max long

  mapping (string => Layer) layers;

  // Define a new event to notify when a layer is added
  event LayerAdded(string name, string description);
  
  // Define a new event to notify when a message is added
  event EmbedAdded(string layer, string content, SD59x18 lat, SD59x18 long);

  function getLayer( string calldata name) public view returns (Layer memory) {
    Layer memory layer = layers[name];
    // check if layer exists
    require(bytes(layer.name).length != 0);
    return layer;
  }

  function getEmbeds(string calldata layerName) public view returns (Embed[] memory embeds) {
    Layer memory layer = layers[layerName];
      // check if layer exists
    require(bytes(layer.name).length != 0);

    return layer.embeds;
  }
  
  function addLayer(string calldata name, string calldata description, Location calldata startingLocation) public {
      require(bytes(layers[name].name).length == 0, "Layer already exists");
      require(startingLocation.lat.gt(sd(-90e18)) && startingLocation.lat.lt(sd(90e18)) && startingLocation.long.gt(sd(-180)) && startingLocation.long.lt(sd(180)), "Invalid location");
  
      // Initialize the new layer
      Layer storage newLayer = layers[name];
      newLayer.name = name;
      newLayer.description = description;
      newLayer.startingLoc = startingLocation;
  
      // Emit event for adding a layer
      emit LayerAdded(name, description);
  }
  
  function addMessage(
      string calldata layerName,
      SD59x18 lat,
      SD59x18 long,
      string calldata message
  ) public {
      // Check if lat and long are valid
      require(lat.gt(sd(-90e18)) && lat.lt(sd(90e18)) && long.gt(sd(-180)) && long.lt(sd(180)), "Invalid location");
      Layer memory layer = layers[layerName];

      // check if layer exists
      require(bytes(layer.name).length != 0);
  
      Location memory location = Location(lat, long);
      Embed memory embed = Embed(layer.embedN++, Kinds.Message, message, location);
  
      layers[layerName].embeds.push(embed);
  }
}