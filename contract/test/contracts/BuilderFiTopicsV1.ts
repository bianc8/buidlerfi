import chai from "chai";
import { ethers, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";

import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import type { BuilderFiTopicsV1 } from "../../typechain-types";

chai.use(solidity);

const { expect } = chai;
const { parseUnits } = ethers.utils;
const { deployContract } = ethers;

describe("BuilderFi-topics", () => {
  let creator: SignerWithAddress;
  let shareOwner: SignerWithAddress;
  let shareBuyer: SignerWithAddress;

  let builderFi: BuilderFiTopicsV1;

  beforeEach(async () => {
    [creator, shareOwner, shareBuyer] = await ethers.getSigners();
  });

  it("can be deployed", async () => {
    const action = deployContract("BuilderFiTopicsV1", [creator.address, ["web3"]]);

    await expect(action).not.to.be.reverted;
  });

  const builder = async () => {
    return deployContract("BuilderFiTopicsV1", [creator.address, ["web3"]]) as Promise<BuilderFiTopicsV1>;
  };

  describe("testing functions", () => {
    beforeEach(async () => {
      builderFi = await builder();

      await builderFi.setFeeDestination("0x33041027dd8F4dC82B6e825FB37ADf8f15d44053");
      await builderFi.setProtocolFeePercent(ethers.utils.parseUnits("0.05")); // 5%
      await builderFi.setBuilderFeePercent(ethers.utils.parseUnits("0.05")); // 5%

      await builderFi.connect(creator).enableTrading();
    });

    it("does not allow anyone to buy a topic share before its creation", async () => {
      const action = builderFi.connect(creator).buyShares("test#1", creator.address);

      await expect(action).to.be.reverted;
    });

    it("does not allow an address other than the owner to create a topic share", async () => {
      const action = builderFi.connect(shareBuyer).createTopic(["test#2"]);

      await expect(action).to.be.reverted;
    });

    it("allows the owner to create a topic share", async () => {
      const action = builderFi.connect(creator).createTopic(["test#3"]);

      await expect(action).not.to.be.reverted;
    });

    it("does not allow the owner to create another time an existing key", async () => {
      const action = builderFi.connect(shareBuyer).createTopic(["test#3"]);

      await expect(action).to.be.reverted;
    });

    it("allows the owner to create multiple topic shares at once", async () => {
      const action = builderFi.connect(creator).createTopic(["test#4", "test#5", "test#6"]);

      await expect(action).not.to.be.reverted;
    });

    ///

    // fail -> owner can't override an existing topic
    /*
    it("changes the price after the first buy happens", async () => {
      await builderFi.connect(shareOwner).buyShares(shareOwner.address);

      expect(await builderFi.getBuyPrice(shareOwner.address)).to.eq(parseUnits("0.0000625"));
    });

    it("changes the supply of builder keys after the first buy happens", async () => {
      await builderFi.connect(shareOwner).buyShares(shareOwner.address);

      expect(await builderFi.builderKeysSupply(shareOwner.address)).to.eq(1);
    });

    it("changes the balance of builder keys after the first buy happens", async () => {
      await builderFi.connect(shareOwner).buyShares(shareOwner.address);

      expect(await builderFi.builderKeysBalance(shareOwner.address, shareOwner.address)).to.eq(1);
    });

    it("does not allow a key to be purchased for less than the amount expected", async () => {
      await builderFi.connect(shareOwner).buyShares(shareOwner.address);

      const price = await builderFi.getBuyPriceAfterFee(shareOwner.address);

      const action = builderFi.connect(shareBuyer).buyShares(shareOwner.address, { value: price.sub(1) });

      await expect(action).to.be.reverted;
    });

    it("allows a owner to sell their key", async () => {
      await builderFi.connect(shareOwner).buyShares(shareOwner.address);

      const price = await builderFi.getBuyPriceAfterFee(shareOwner.address);

      await builderFi.connect(shareBuyer).buyShares(shareOwner.address, { value: price });

      expect(await builderFi.builderKeysBalance(shareOwner.address, shareBuyer.address)).to.eq(1);

      await builderFi.connect(shareBuyer).sellShares(shareOwner.address);

      expect(await builderFi.builderKeysBalance(shareOwner.address, shareBuyer.address)).to.eq(0);
    });

    it("selling keys increased the amount of Eth the owner and the protocol have", async () => {
      await builderFi.connect(shareOwner).buyShares(shareOwner.address);

      const priceFirstKey = await builderFi.getBuyPriceAfterFee(shareOwner.address);
      await builderFi.connect(shareBuyer).buyShares(shareOwner.address, { value: priceFirstKey });

      const priceSecondKey = await builderFi.getBuyPriceAfterFee(shareOwner.address);
      await builderFi.connect(shareBuyer).buyShares(shareOwner.address, { value: priceSecondKey });

      const balanceBefore = await ethers.provider.getBalance("0x33041027dd8F4dC82B6e825FB37ADf8f15d44053");
      const builderBalanceBefore = await ethers.provider.getBalance(shareOwner.address);

      await builderFi.connect(shareBuyer).sellShares(shareOwner.address);

      expect(await builderFi.builderKeysBalance(shareOwner.address, shareBuyer.address)).to.eq(1);

      const balanceAfter = await ethers.provider.getBalance("0x33041027dd8F4dC82B6e825FB37ADf8f15d44053");
      const builderBalanceAfter = await ethers.provider.getBalance(shareOwner.address);

      expect(balanceAfter.toNumber()).to.be.greaterThan(balanceBefore.toNumber());
      expect(builderBalanceAfter.sub(builderBalanceBefore).toNumber()).to.be.greaterThan(0);
    });
    */
  });
});
