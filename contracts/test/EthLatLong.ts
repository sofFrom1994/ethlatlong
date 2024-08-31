import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("EthLatLong", function () {

  const defaultLayerColor = 1028;
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

      await ethLatLong.write.addLayer([layerName, description, lat, long, defaultLayerColor], { account: owner.account });

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
        ethLatLong.write.addLayer([layerName, description, invalidLat, validLong, defaultLayerColor], { account: owner.account })
      ).to.be.rejectedWith("Invalid location");
    });

    it("Should not allow adding a layer with the same name", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const layerName = "DuplicateLayer";
      const description = "This is a duplicate layer";
      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);

      await ethLatLong.write.addLayer([layerName, description, lat, long, defaultLayerColor], { account: owner.account });

      await expect(
        ethLatLong.write.addLayer([layerName, description, lat, long, defaultLayerColor], { account: owner.account })
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

      await ethLatLong.write.addLayer([layerName, description, lat, long, defaultLayerColor], { account: owner.account });
      await ethLatLong.write.addMessage([layerName, lat, long, message], { account: owner.account });

      const layer = await ethLatLong.read.getLayer([layerName]);
      expect(layer.embeds[0].message).to.equal(message);
    });

    it("Different embeds on a layer should have different ids", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const layerName = "MessageLayer";
      const description = "This layer is for messages";
      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);
      const message1 = "Hello, World!";
      const message2 = "Hello, World!";

      await ethLatLong.write.addLayer([layerName, description, lat, long, defaultLayerColor], { account: owner.account });
      await ethLatLong.write.addMessage([layerName, lat, long, message1], { account: owner.account });
      await ethLatLong.write.addMessage([layerName, lat, long, message2], { account: owner.account });

      const embeds = await ethLatLong.read.getEmbeds(["MessageLayer"]);
      console.log(embeds);
      expect(embeds[0].id).to.not.equal(embeds[1].id);
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

      await ethLatLong.write.addLayer([layerName, description, lat, long, defaultLayerColor], { account: owner.account });
      await ethLatLong.write.addMedia([erc721Address, BigInt(tokenID), lat, long, layerName, mediaDescription], { account: owner.account });

      const layer = await ethLatLong.read.getLayer([layerName]);
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

      await ethLatLong.write.addLayer([layerName, description, lat, long, defaultLayerColor], { account: owner.account });

      await expect(
        ethLatLong.write.addMedia([erc721Address, tokenId, lat, long, layerName, mediaDescription], { account: otherAccount.account })
      ).to.be.rejectedWith("Caller is not the owner of the token");
    });

    it("Should add and remove a message embed", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);

      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);
      // Add a layer
      await ethLatLong.write.addLayer(["TestLayer", "Test Description", lat, long, defaultLayerColor]);

      // Add a message embed
      await ethLatLong.write.addMessage(["TestLayer", lat, long, "Test Message"]);

      // Get the embeds
      const embeds = await ethLatLong.read.getEmbeds(["TestLayer"]);
      expect(embeds.length).to.equal(1);
      expect(embeds[0].kind).to.equal(0); // Kinds.Message
      //expect(embeds[0].author).to.equal(owner.account.address);

      // Remove the message embed
      await ethLatLong.write.removeMessage(["TestLayer", embeds[0].id]);

      // Get the embeds again
      const updatedEmbeds = await ethLatLong.read.getEmbeds(["TestLayer"]);
      expect(updatedEmbeds.length).to.equal(0);
    });

    it("Should fail to remove message embed if not the author", async function () {
      const { ethLatLong, owner, otherAccount } = await loadFixture(deployEthLatLong);

      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);
      // Add a layer
      await ethLatLong.write.addLayer(["TestLayer", "Test Description", lat, long, defaultLayerColor]);

      // Add a message embed
      await ethLatLong.write.addMessage(["TestLayer", lat, long, " some message "]);

      // Get the embeds
      const embeds = await ethLatLong.read.getEmbeds(["TestLayer"]);
      expect(embeds.length).to.equal(1);

      await expect(ethLatLong.write.removeMessage(["TestLayer", embeds[0].id], { account: otherAccount.account })).to.be.rejectedWith(
        "Caller is not the author of the message"
      );
    });

    /*
    it("Should add and remove a media embed", async function () {
      const { ethLatLong, owner, otherAccount } = await loadFixture(deployEthLatLong);
      // Add a layer
      await ethLatLong.write.addLayer("TestLayer", "Test Description", 0, 0, 0xFFFFFF);

      // Add a media embed
      await ethLatLong.write.addMedia(owner.address, 1, 0, 0, "TestLayer", "Test Media Description");

      // Get the embeds
      const embeds = await ethLatLong.read.getEmbeds("TestLayer");
      expect(embeds.length).to.equal(1);
      expect(embeds[0].kind).to.equal(0); // Kinds.Media
      expect(embeds[0].author).to.equal(owner.address);

      // Remove the media embed
      await ethLatLong.write.removeMedia("TestLayer", embeds[0].id);

      // Get the embeds again
      const updatedEmbeds = await ethLatLong.read.getEmbeds("TestLayer");
      expect(updatedEmbeds.length).to.equal(0);
    });

    it("Should fail to remove media embed if not the author", async function () {
      const { ethLatLong, owner, otherAccount } = await loadFixture(deployEthLatLong);
      // Add a layer
      await ethLatLong.write.addLayer("TestLayer", "Test Description", 0, 0, 0xFFFFFF);

      // Add a media embed
      await ethLatLong.write.addMedia(owner.address, 1, 0, 0, "TestLayer", "Test Media Description");

      // Get the embeds
      const embeds = await ethLatLong.read.getEmbeds("TestLayer");
      expect(embeds.length).to.equal(1);

      // Attempt to remove the media embed as a non-author
      await expect(ethLatLong.write.removeMedia("TestLayer", embeds[0].id)).to.be.revertedWith(
        "Caller is not the author of the media"
      );
    });
    */
  });

  describe("Layer and Embed Retrieval", function () {
    it("Should retrieve all layers", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const layerName1 = "Layer1";
      const layerName2 = "Layer2";
      const description1 = "This is layer 1";
      const description2 = "This is layer 2";
      const lat1 = BigInt(40.7128e18);
      const long1 = BigInt(-74.0060e18);
      const lat2 = BigInt(34.0522e18);
      const long2 = BigInt(-118.2437e18);

      await ethLatLong.write.addLayer([layerName1, description1, lat1, long1, defaultLayerColor], { account: owner.account });
      await ethLatLong.write.addLayer([layerName2, description2, lat2, long2, defaultLayerColor], { account: owner.account });

      const allLayers = await ethLatLong.read.getAllLayers();
      expect(allLayers.length).to.equal(2);
      expect(allLayers[0].name).to.equal(layerName1);
      expect(allLayers[1].name).to.equal(layerName2);
    });

    it("Should retrieve all embeds", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const layerName = "EmbedLayer";
      const description = "This layer is for embeds";
      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);
      const message1 = "Hello, World!";
      const message2 = "Hello, Ethereum!";

      await ethLatLong.write.addLayer([layerName, description, lat, long, defaultLayerColor], { account: owner.account });
      await ethLatLong.write.addMessage([layerName, lat, long, message1], { account: owner.account });
      await ethLatLong.write.addMessage([layerName, lat, long, message2], { account: owner.account });

      const allEmbeds = await ethLatLong.read.getAllEmbeds();
      expect(allEmbeds.length).to.equal(2);
      expect(allEmbeds[0].message).to.equal(message1);
      expect(allEmbeds[1].message).to.equal(message2);
    });

    it("Should retrieve embeds for a specific layer", async function () {
      const { ethLatLong, owner } = await loadFixture(deployEthLatLong);
      const layerName = "SpecificLayer";
      const description = "This layer is for specific embeds";
      const lat = BigInt(40.7128e18);
      const long = BigInt(-74.0060e18);
      const message1 = "Hello, World!";
      const message2 = "Hello, Ethereum!";

      await ethLatLong.write.addLayer([layerName, description, lat, long, defaultLayerColor], { account: owner.account });
      await ethLatLong.write.addMessage([layerName, lat, long, message1], { account: owner.account });
      await ethLatLong.write.addMessage([layerName, lat, long, message2], { account: owner.account });

      const embeds = await ethLatLong.read.getEmbeds([layerName]);
      expect(embeds.length).to.equal(2);
      expect(embeds[0].message).to.equal(message1);
      expect(embeds[1].message).to.equal(message2);
    });
  });

});