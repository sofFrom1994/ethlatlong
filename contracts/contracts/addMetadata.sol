// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ERC721Metadata {
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
}
