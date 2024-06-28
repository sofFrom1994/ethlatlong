import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("EthLatLong", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployEthLatLong() {

    // Contracts are deployed using the first signer/account by default
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

  describe("Deployment", function () {
    it("Should set the right starting layer and message", async function () {
      //const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

      //expect(await lock.read.unlockTime()).to.equal(unlockTime);
    });

    it("Should receive and store the funds to lock", async function () {
      //const { lock, lockedAmount, publicClient } = await loadFixture(
      //  deployOneYearLockFixture
      //);

      //expect(
      //  await publicClient.getBalance({
      //    address: lock.address,
      //  })
      //).to.equal(lockedAmount);
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      //const latestTime = BigInt(await time.latest());
      //await expect(
      //  hre.viem.deployContract("Lock", [latestTime], {
      //    value: 1n,
      //  })
      //).to.be.rejectedWith("Unlock time should be in the future");
    });
  });
  
});
