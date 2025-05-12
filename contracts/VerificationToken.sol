// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Simplified version for demo
contract VerificationToken is ERC20, Ownable {
    // Mapping to track verification fees per credential type
    mapping(string => uint256) private _verificationFees;
    
    // Address of the CredentialManager contract
    address public credentialManager;

    constructor(
        string memory name,
        string memory symbol,
        address _credentialManager
    ) ERC20(name, symbol) {
        credentialManager = _credentialManager;
        
        // Mint initial supply to the owner
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    // Set verification fee for a credential type
    function setVerificationFee(string memory credentialType, uint256 fee) 
        public 
        onlyOwner 
    {
        _verificationFees[credentialType] = fee;
    }

    // Get verification fee for a credential type
    function getVerificationFee(string memory credentialType) 
        public 
        view 
        returns (uint256) 
    {
        return _verificationFees[credentialType];
    }

    // Pay for verification of a credential
    function payForVerification(
        uint256 passportId,
        string memory credentialType
    ) public returns (bool) {
        uint256 fee = _verificationFees[credentialType];
        require(fee > 0, "Verification fee not set");
        
        // Transfer the fee from the caller to this contract
        _transfer(msg.sender, address(this), fee);
        
        return true;
    }

    // Allow the owner to withdraw collected fees
    function withdrawFees() public onlyOwner {
        uint256 balance = balanceOf(address(this));
        _transfer(address(this), owner(), balance);
    }

    // Update the CredentialManager address
    function setCredentialManager(address _credentialManager) 
        public 
        onlyOwner 
    {
        credentialManager = _credentialManager;
    }
}
