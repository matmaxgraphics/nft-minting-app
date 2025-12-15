import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";
import { zeroAddress } from "viem";

describe("MyNFT Contract", async function () {
  const { viem } = await network.connect();

  const publicClient = await viem.getPublicClient();
  const [owner, addr1] = await viem.getWalletClients();

  let nft: any;
  let deploymentBlock: bigint;

  beforeEach(async function () {
    nft = await viem.deployContract("MyNFT", [owner.account.address]);
    deploymentBlock = await publicClient.getBlockNumber();
  });

  describe("Deployment", function () {
    it("should verify name and symbol", async function () {
      assert.equal(await nft.read.name(), "MyNFT");
      assert.equal(await nft.read.symbol(), "MNFT");
    });

    it("should set the correct owner", async function () {
      assert.equal(
        (await nft.read.owner()).toLowerCase(),
        owner.account.address.toLowerCase()
      );
    });
  });

  describe("Minting", function () {
    it("should mint a new NFT to the specified address", async function () {
      const tokenURI = "ipfs://example-metadata-cid";

      await nft.write.mint([addr1.account.address, tokenURI], {
        account: owner.account,
      });

      assert.equal(
        (await nft.read.ownerOf([0n])).toLowerCase(),
        addr1.account.address.toLowerCase()
      );
      assert.equal(
        await nft.read.balanceOf([addr1.account.address]),
        BigInt(1)
      );
    });

    it("should set the correct token URI", async function () {
      const tokenURI = "ipfs://my-unique-uri";

      await nft.write.mint([addr1.account.address, tokenURI], {
        account: owner.account,
      });

      assert.equal(await nft.read.tokenURI([BigInt(0)]), tokenURI);
    });

    it("should emit a Transfer event on mint", async function () {
      const tokenURI = "ipfs://event-test";

      await nft.write.mint([addr1.account.address, tokenURI], {
        account: owner.account,
      });

      const events = await publicClient.getContractEvents({
        address: nft.address,
        abi: nft.abi,
        eventName: "Transfer",
        fromBlock: deploymentBlock,
        strict: false,
      });

      assert.equal(events.length, 1);
      assert.equal(events[0].args.from, zeroAddress);
      assert.equal(
        events[0].args.to.toLowerCase(),
        addr1.account.address.toLowerCase()
      );
      assert.equal(events[0].args.tokenId, BigInt(0));
    });
  });
});
