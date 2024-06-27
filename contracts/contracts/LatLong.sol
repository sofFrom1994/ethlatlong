// SPDX-License-Identifier: UNKNOWN 
pragma solidity ^0.8.24;

import { SD59x18, sd } from "@prb/math/src/SD59x18.sol";

contract LatLong {
  enum Kinds { message, path, media }

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
    Embed[] embeds;
  }

  mapping (string => Layer) layers;

// Define a new event to notify when a layer is added
event LayerAdded(string name, string description);

// Define a new event to notify when a message is added
event EmbedAdded(string layer, string content, SD59x18 lat, SD59x18 long);

function addLayer(string calldata name, string calldata description) public {
    // Check if the layer already exists
    require(bytes(layers[name].name).length == 0, "Layer already exists");

    // Initialize the new layer
    Layer storage newLayer = layers[name];
    newLayer.name = name;
    newLayer.description = description;

    // Emit event for adding a layer
    emit LayerAdded(name, description);
}

function addEmbed(
    Embed calldata embed,
    string calldata layerName,
    SD59x18 lat,
    SD59x18 long
) public {
    // Check if lat and long are valid (implement your own validation)
    // For example: require(lat >= -90 && lat <= 90, "Invalid latitude");
    // require(long >= -180 && long <= 180, "Invalid longitude");

    // Check if the layer exists
    require(bytes(layers[layerName].name).length != 0, "Layer does not exist");

    // Add the message to the layer
    layers[layerName].embeds.push(embed);

    // Emit event for adding a message
    emit EmbedAdded(layerName, embed.message, lat, long);
}
}