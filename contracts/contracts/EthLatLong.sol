pragma solidity ^0.8.24;

import { SD59x18, sd } from "@prb/math/src/SD59x18.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


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

    function getAllLayers() public view returns (Layer[] memory) {
        Layer[] memory allLayers = new Layer[](layerNames.length);

        for (uint i = 0; i < layerNames.length; i++) {
            string memory layerName = layerNames[i]; // Load layer name into memory 
            allLayers[i] = layers[layerName]; // Pass it to getLayer
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

/*
  // Struct to hold metadata
    struct Metadata {
        string description;
        int256 latitude;
        int256 longitude;
    }

    // Mapping from ERC-721 contract address to token ID to metadata
    mapping(address => mapping(uint256 => Metadata)) private _metadata;

    // Event to log the addition of metadata
    event MetadataAdded(address indexed erc721Address, uint256 indexed tokenId, string description, int256 latitude, int256 longitude);

    // Function to add metadata to a token
    function addMetadata(
        address erc721Address,
        uint256 tokenId,
        string calldata description,
        int256 latitude,
        int256 longitude
    ) external {
        // Verify the caller is the owner of the token
        IERC721 erc721 = IERC721(erc721Address);
        address tokenOwner = erc721.ownerOf(tokenId);
        require(tokenOwner == msg.sender, "Caller is not the owner of the token");

        // Validate latitude and longitude
        require(latitude >= -90 && latitude <= 90, "Latitude must be between -90 and 90");
        require(longitude >= -180 && longitude <= 180, "Longitude must be between -180 and 180");

        // Update the metadata
        _metadata[erc721Address][tokenId] = Metadata(description, latitude, longitude);

        // Emit an event for logging
        emit MetadataAdded(erc721Address, tokenId, description, latitude, longitude);
    }

    // Function to get the metadata of a token
    function getMetadata(address erc721Address, uint256 tokenId) external view returns (string memory description, int256 latitude, int256 longitude) {
        Metadata storage metadata = _metadata[erc721Address][tokenId];
        return (metadata.description, metadata.latitude, metadata.longitude);
    }

    // Function to remove metadata from a token
    function removeMetadata(address erc721Address, uint256 tokenId) external {
        // Verify the caller is the owner of the token
        IERC721 erc721 = IERC721(erc721Address);
        address tokenOwner = erc721.ownerOf(tokenId);
        require(tokenOwner == msg.sender, "Caller is not the owner of the token");

        // Delete the metadata
        delete _metadata[erc721Address][tokenId];
    }
    */

}