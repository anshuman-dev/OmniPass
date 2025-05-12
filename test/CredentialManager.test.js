const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CredentialManager", function () {
  let CredentialManager;
  let credentialManager;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Create a mock LayerZero endpoint address
    const mockLzEndpoint = owner.address;
    
    // Deploy the CredentialManager contract
    CredentialManager = await ethers.getContractFactory("CredentialManager");
    credentialManager = await CredentialManager.deploy(mockLzEndpoint);
    await credentialManager.deployed();
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await credentialManager.owner()).to.equal(owner.address);
    });
  });
  
  describe("Credential Management", function () {
    it("Should create a new credential", async function () {
      // Mock passport ID
      const passportId = 1;
      
      // Create a credential
      await credentialManager.createCredential(
        passportId,
        "Test Credential",
        "{\"attribute\":\"value\"}"
      );
      
      // Get the credential
      const credentials = await credentialManager.getPassportCredentials(passportId);
      
      // Check credential data
      expect(credentials.length).to.equal(1);
      expect(credentials[0].passportId).to.equal(passportId);
      expect(credentials[0].credentialType).to.equal("Test Credential");
      expect(credentials[0].data).to.equal("{\"attribute\":\"value\"}");
      expect(credentials[0].issuer).to.equal(owner.address);
      expect(credentials[0].isValid).to.equal(true);
    });
    
    it("Should verify a credential type", async function () {
      // Mock passport ID
      const passportId = 1;
      
      // Create a credential
      await credentialManager.createCredential(
        passportId,
        "Test Credential",
        "{\"attribute\":\"value\"}"
      );
      
      // Verify credential
      const isVerified = await credentialManager.verifyCredential(
        passportId,
        "Test Credential"
      );
      
      expect(isVerified).to.equal(true);
      
      // Verify non-existent credential
      const isInvalidVerified = await credentialManager.verifyCredential(
        passportId,
        "Non-existent Credential"
      );
      
      expect(isInvalidVerified).to.equal(false);
    });
    
    it("Should allow owner to revoke a credential", async function () {
      // Mock passport ID and credential ID
      const passportId = 1;
      
      // Create a credential
      await credentialManager.createCredential(
        passportId,
        "Test Credential",
        "{\"attribute\":\"value\"}"
      );
      
      // Get credentials
      let credentials = await credentialManager.getPassportCredentials(passportId);
      const credentialId = 0; // First credential ID
      
      // Revoke credential
      await credentialManager.revokeCredential(credentialId);
      
      // Get credentials again
      credentials = await credentialManager.getPassportCredentials(passportId);
      
      // Check credential validity
      expect(credentials[0].isValid).to.equal(false);
      
      // Verify credential should fail now
      const isVerified = await credentialManager.verifyCredential(
        passportId,
        "Test Credential"
      );
      
      expect(isVerified).to.equal(false);
    });
    
    it("Should allow credential issuer to revoke their credential", async function () {
      // Mock passport ID
      const passportId = 1;
      
      // Create a credential as addr1
      await credentialManager.connect(addr1).createCredential(
        passportId,
        "Test Credential",
        "{\"attribute\":\"value\"}"
      );
      
      // Get credentials
      let credentials = await credentialManager.getPassportCredentials(passportId);
      const credentialId = 0; // First credential ID
      
      // Revoke credential as addr1 (the issuer)
      await credentialManager.connect(addr1).revokeCredential(credentialId);
      
      // Get credentials again
      credentials = await credentialManager.getPassportCredentials(passportId);
      
      // Check credential validity
      expect(credentials[0].isValid).to.equal(false);
    });
    
    it("Should not allow non-issuer or non-owner to revoke a credential", async function () {
      // Mock passport ID
      const passportId = 1;
      
      // Create a credential as addr1
      await credentialManager.connect(addr1).createCredential(
        passportId,
        "Test Credential",
        "{\"attribute\":\"value\"}"
      );
      
      // Get credentials
      const credentials = await credentialManager.getPassportCredentials(passportId);
      const credentialId = 0; // First credential ID
      
      // Try to revoke credential as addr2 (not the issuer or owner)
      await expect(
        credentialManager.connect(addr2).revokeCredential(credentialId)
      ).to.be.revertedWith("Not authorized to revoke");
    });
  });
});
