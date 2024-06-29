// a license
pragma solidity ^0.8.24;

import { SD59x18, sd } from "@prb/math/src/SD59x18.sol";

contract EthLatLong {
  enum Kinds { Message, Path, Media }

  struct Embed {
    uint id;
    Kinds kind;
    string message;
    SD59x18 lat;
    SD59x18 long;
    address author;
  }

  struct Layer {
    string name;
    string description;
    // maybe owner / have a permissioned layer
    uint embedN;
    Embed[] embeds;
    SD59x18 lat;
    SD59x18 long;
    address author;
  }

  //constants
  // min lat, min long, max lat, max long
  string[] public layerNames;
  mapping (string => Layer) layers;

  // Define a new event to notify when a layer is added
  event LayerAdded(string name, string description);
  
  function getLayer( string memory name) public view returns (Layer memory) {
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
  
  function addLayer(string calldata name, string calldata description, SD59x18 lat, SD59x18 long) public {
      require(bytes(layers[name].name).length == 0, "Layer already exists");
      require(lat.gt(sd(-90e18)) && lat.lt(sd(90e18)) && long.gt(sd(-180)) && long.lt(sd(180)), "Invalid location");
  
      // Initialize the new layer
      Layer storage newLayer = layers[name];
      newLayer.name = name;
      newLayer.description = description;
      newLayer.lat = lat;
      newLayer.long = long;
      newLayer.author = msg.sender;

      layerNames.push(name);
  
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
  
      Embed memory embed = Embed(layer.embedN++, Kinds.Message, message, lat, long, msg.sender);
  
      layers[layerName].embeds.push(embed);
  }
    function getAllLayers() public view returns (Layer[] memory) {
        Layer[] memory allLayers = new Layer[](layerNames.length);

        for (uint i = 0; i < layerNames.length; i++) {
            string memory layerName = layerNames[i]; // Load layer name into memory 
            allLayers[i] = getLayer(layerName); // Pass it to getLayer
        }

        return allLayers;
    }

    function getAllEmbeds() public view returns (Embed[] memory) {
        Layer[] memory allLayers = getAllLayers();
        uint totalEmbedCount = 0;

        // Calculate total number of embeds
        for (uint i = 0; i < allLayers.length; i++) {
            totalEmbedCount += allLayers[i].embeds.length;
        }

        Embed[] memory allEmbeds = new Embed[](totalEmbedCount);
        uint embedIndex = 0;
        
        // Gather all embeds
        for (uint i = 0; i < allLayers.length; i++) {
            for (uint j = 0; j < allLayers[i].embeds.length; j++) {
                allEmbeds[embedIndex++] = allLayers[i].embeds[j];
            }
        }

        return allEmbeds;
    }

}