const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
// const ethers = require("ethers");

describe("NftLock", async function () {
  const [owner, otherAccount] = await ethers.getSigners();

  describe("Deployment", async function () {
    it("should have address", async() => {
      let NftLockContract = await ethers.getContractFactory("NftLock");
      NftLockContract = await NftLockContract.deploy();
      expect(ethers.utils.isAddress(NftLockContract.address)).to.equal(true)
    })
  })

  describe("Send 1155 tokens", function () {
    it("should accept ERC1155 tokens", async () => {
      let NftLockContract = await ethers.getContractFactory("NftLock");
      NftLockContract = await NftLockContract.deploy();

      let Just1155 = await ethers.getContractFactory("Just1155");
      Just1155 = await Just1155.deploy();

      // address account, uint256 id, uint256 amount, bytes memory data
      let mintRes = await Just1155.connect(owner).mint(owner.address, 1, 100, [])
      mintRes = await mintRes.wait()

      // address from, address to, uint256[] ids, uint256[] amounts, bytes data
      await Just1155.safeTransferFrom(owner.address, NftLockContract.address, 1, 1, [])

      const balance = await Just1155.balanceOf(NftLockContract.address, 1)

      expect(balance.toNumber()).to.equal(1)
    })
  })
})
