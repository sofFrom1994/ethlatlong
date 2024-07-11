pragma solidity ^0.8.24;

import { SD59x18, sd } from "@prb/math/src/SD59x18.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract EthLatLong {
  enum Kinds { Message, Path, Media }

  struct Embed {
    uint id;
    Kinds kind;
    string message;
    SD59x18 lat;
    SD59x18 long;
    address author;
    string url;
    string description;
  }

  struct Layer {
    uint id;
    string name;
    string description;
    // maybe owner / have a permissioned layer
    uint embedN;
    Embed[] embeds;

    SD59x18 lat;
    SD59x18 long;
    address author;
  }

  uint layerCount;
  string[] public layerNames;
  mapping (string => Layer) layers;

  // Define a new event to notify when a layer is added
  event LayerAdded(string name, string description);

  modifier validCoordinates(SD59x18 lat, SD59x18 long) {
        require(
            lat.gt(sd(-90e18)) && lat.lt(sd(90e18)) && 
            long.gt(sd(-180e18)) && long.lt(sd(180e18)), 
            "Invalid location"
        );
        _;
    }
  
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
  
  function addLayer(string calldata name, string calldata description, SD59x18 lat, SD59x18 long) public validCoordinates(lat, long)  {
      require(bytes(layers[name].name).length == 0, "Layer already exists");
  
      // Initialize the new layer
      Layer storage newLayer = layers[name];
      newLayer.name = name;
      newLayer.description = description;
      newLayer.lat = lat;
      newLayer.long = long;
      newLayer.author = msg.sender;
      newLayer.id = layerCount;

      layerNames.push(name);
      layerCount++;
  
      // Emit event for adding a layer
      emit LayerAdded(name, description);
  }
  
  function addMessage(
      string calldata layerName,
      SD59x18 lat,
      SD59x18 long,
      string calldata message
  ) public validCoordinates(lat, long) {
      Layer memory layer = layers[layerName];
      // check if layer exists
      require(bytes(layer.name).length != 0);
      Embed memory embed = Embed(layer.embedN++, Kinds.Message, message, lat, long, msg.sender, "", "");
      layers[layerName].embeds.push(embed);
  }

    function addMedia(
        address erc721Address,
        uint256 tokenId,
        SD59x18 lat,
        SD59x18 long,
        string calldata layerName,
        string calldata description
    ) public validCoordinates(lat, long) {

        // Verify the caller is the owner of the token
        IERC721 erc721 = IERC721(erc721Address);
        address tokenOwner = erc721.ownerOf(tokenId);
        require(tokenOwner == msg.sender, "Caller is not the owner of the token");

        // Ensure the ERC-721 contract supports tokenURI
        IERC721Metadata erc721Metadata = IERC721Metadata(erc721Address);
        require(bytes(erc721Metadata.tokenURI(tokenId)).length != 0, "ERC721 does not support tokenURI");

        Layer memory layer = layers[layerName];

        // check if layer exists
        require(bytes(layer.name).length != 0);
        string memory uri = erc721Metadata.tokenURI(tokenId);

        Embed memory embed = Embed(layer.embedN++, Kinds.Media, "", lat, long, msg.sender, uri, description); 
        layers[layerName].embeds.push(embed);
    }

    // Function to remove metadata from a token
    function removeMetadata(address erc721Address, uint256 tokenId) external {
      // todo
    }

    // function addPath ( description, Location[], layerName )
}