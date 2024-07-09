import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("EthLatLong", function () {
  async function deployEthLatLong() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const ethLatLong = await hre.viem.deployContract("EthLatLong");
    const publicClient = await hre.viem.getPublicClient();

    return {
      ethLatLong,
      owner,
      otherAccount,
      publicClient,
    };
  }

  async function deployMockERC721() {
    const [owner] = await hre.viem.getWalletClients();
    const mockERC721 = await hre.viem.deployContract("MockERC721");
    const tokenID = 1;

    // Mint a token to the owner for testing
    await mockERC721.write.mint([owner.account.address, BigInt(tokenID)], { account: owner.account });

    return {
      mockERC721,
      tokenID
    }
  }


  describe("Deployment", function () {
    it("Should deploy the contract successfully", async function () {
      const { ethLatLong } = await loadFixture(deployEthLatLong);

      expect(ethLatLong).to.not.be.undefined;
    });
  });

  describe("Layer Management", function () {
    it("Should add a new layer", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const layerName = "TestLayer";
      const description = "This is a test layer";
      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);

      await ethLatLong.write.addLayer([layerName, description, lat, long], { account: owner.account });

      const layer = await ethLatLong.read.getLayer([layerName]);
      expect(layer.name).to.equal(layerName);
      expect(layer.description).to.equal(description);
    });

    it("Should not allow adding a layer with invalid coordinates", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const layerName = "InvalidLayer";
      const description = "This layer has invalid coordinates";
      const invalidLat = BigInt(91e18); // Invalid latitude
      const validLong = BigInt(-74.0060e18);

      await expect(
        ethLatLong.write.addLayer([layerName, description, invalidLat, validLong], { account: owner.account })
      ).to.be.rejectedWith("Invalid location");
    });

    it("Should not allow adding a layer with the same name", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const layerName = "DuplicateLayer";
      const description = "This is a duplicate layer";
      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);

      await ethLatLong.write.addLayer([layerName, description, lat, long], { account: owner.account });

      await expect(
        ethLatLong.write.addLayer([layerName, description, lat, long], { account: owner.account })
      ).to.be.rejected;
    });
  });

  describe("Embed Management", function () {
    it("Should add a message to a layer", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const layerName = "MessageLayer";
      const description = "This layer is for messages";
      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);
      const message = "Hello, World!";

      await ethLatLong.write.addLayer([layerName, description, lat, long], { account: owner.account });
      await ethLatLong.write.addMessage([layerName, lat, long, message], { account: owner.account });

      const layer = await ethLatLong.read.getLayer([layerName]);
      expect(layer.embeds[0].message).to.equal(message);
    });

    it("Should add media to a layer", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const { mockERC721, tokenID } = await loadFixture(deployMockERC721);
      const layerName = "MediaLayer";
      const description = "This layer is for media";
      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);
      const erc721Address = mockERC721.address;

      const mediaDescription = "This is a media description";

      await ethLatLong.write.addLayer([layerName, description, lat, long], { account: owner.account });
      await ethLatLong.write.addMedia([erc721Address, BigInt(tokenID), lat, long, layerName, mediaDescription], { account: owner.account });

      const layer = await ethLatLong.read.getLayer([layerName]);
      console.log(layer.embeds[0].description);
      expect(layer.embeds[0].description).to.equal(mediaDescription);
    });

    it("Should not allow adding an embed to a non-existent layer", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const nonExistentLayerName = "NonExistentLayer";
      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);
      const message = "Hello, World!";

      await expect(
        ethLatLong.write.addMessage([nonExistentLayerName, lat, long, message], { account: owner.account })
      ).to.be.rejected;
    });

    it("Should not allow adding media if the caller is not the owner of the token", async function () {
      const { ethLatLong, owner, otherAccount } = await loadFixture(deployEthLatLong);
      const { mockERC721, tokenID } = await loadFixture(deployMockERC721);
      const layerName = "MediaLayer";
      const description = "This layer is for media";
      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);
      const erc721Address = mockERC721.address;
      const tokenId = BigInt(tokenID);
      const mediaDescription = "This is a media description";

      await ethLatLong.write.addLayer([layerName, description, lat, long], { account: owner.account });

      await expect(
        ethLatLong.write.addMedia([erc721Address, tokenId, lat, long, layerName, mediaDescription], { account: otherAccount.account })
      ).to.be.rejectedWith("Caller is not the owner of the token");
    });
  });

  describe("Layer and Embed Retrieval", function () {
    it("Should retrieve all layers", async function () {
      // Test implementation needed
    });

    it("Should retrieve all embeds", async function () {
      // Test implementation needed
    });

    it("Should retrieve embeds for a specific layer", async function () {
      // Test implementation needed
    });
  });

});