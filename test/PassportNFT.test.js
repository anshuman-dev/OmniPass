const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PassportNFT", function () {
  let PassportNFT;
  let passportNFT;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Create a mock LayerZero endpoint address
    const mockLzEndpoint = owner.address;
    const minGasToTransfer = 200000;
    
    // Deploy the PassportNFT contract
    PassportNFT = await ethers.getContractFactory("PassportNFT");
    passportNFT = await PassportNFT.deploy(mockLzEndpoint, minGasToTransfer);
    await passportNFT.deployed();
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await passportNFT.owner()).to.equal(owner.address);
    });
    
    it("Should have the correct name and symbol", async function () {
      expect(await passportNFT.name()).to.equal("OmniPass");
      expect(await passportNFT.symbol()).to.equal("PASSPORT");
    });
  });
  
  describe("Minting", function () {
    it("Should mint a new passport", async function () {
      await passportNFT.mint("Test Passport", "ipfs://testimage", "ipfs://metadata");
      
      // Check token count
      expect(await passportNFT.balanceOf(owner.address)).to.equal(1);
      
      // Check token ownership
      expect(await passportNFT.ownerOf(0)).to.equal(owner.address);
      
      // Check token URI
      expect(await passportNFT.tokenURI(0)).to.equal("ipfs://metadata");
      
      // Check passport metadata
      const metadata = await passportNFT.getPassportMetadata(0);
      expect(metadata.name).to.equal("Test Passport");
      expect(metadata.image).to.equal("ipfs://testimage");
      expect(metadata.owner).to.equal(owner.address);
    });
    
    it("Should allow others to mint a passport", async function () {
      await passportNFT.connect(addr1).mint("Addr1 Passport", "ipfs://addr1image", "ipfs://addr1metadata");
      
      // Check token count
      expect(await passportNFT.balanceOf(addr1.address)).to.equal(1);
      
      // Check token ownership
      expect(await passportNFT.ownerOf(0)).to.equal(addr1.address);
      
      // Check passport metadata
      const metadata = await passportNFT.getPassportMetadata(0);
      expect(metadata.name).to.equal("Addr1 Passport");
      expect(metadata.owner).to.equal(addr1.address);
    });
  });
});
