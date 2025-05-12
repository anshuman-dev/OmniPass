// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

// Simplified version for demo
contract CredentialManager is Ownable {
    // Credential structure
    struct Credential {
        uint256 passportId;
        string credentialType;
        string data;
        uint256 issuanceTimestamp;
        address issuer;
        bool isValid;
    }

    // Mapping from passport ID to array of credential IDs
    mapping(uint256 => uint256[]) private _passportCredentials;
    
    // Mapping from credential ID to Credential
    mapping(uint256 => Credential) private _credentials;
    
    // Counter for credential IDs
    uint256 private _credentialIdCounter;

    // Events
    event CredentialIssued(uint256 indexed passportId, uint256 indexed credentialId, string credentialType);

    constructor() {}

    // Create a new credential
    function createCredential(
        uint256 passportId,
        string memory credentialType,
        string memory data
    ) public returns (uint256) {
        uint256 credentialId = _credentialIdCounter++;
        
        _credentials[credentialId] = Credential({
            passportId: passportId,
            credentialType: credentialType,
            data: data,
            issuanceTimestamp: block.timestamp,
            issuer: msg.sender,
            isValid: true
        });
        
        _passportCredentials[passportId].push(credentialId);
        
        emit CredentialIssued(passportId, credentialId, credentialType);
        
        return credentialId;
    }

    // Verify if a passport has a specific credential type
    function verifyCredential(
        uint256 passportId,
        string memory credentialType
    ) public view returns (bool) {
        uint256[] memory credentialIds = _passportCredentials[passportId];
        
        for (uint i = 0; i < credentialIds.length; i++) {
            Credential memory cred = _credentials[credentialIds[i]];
            if (
                cred.isValid && 
                keccak256(bytes(cred.credentialType)) == keccak256(bytes(credentialType))
            ) {
                return true;
            }
        }
        
        return false;
    }

    // Get all credentials for a passport
    function getPassportCredentials(uint256 passportId) 
        public 
        view 
        returns (Credential[] memory) 
    {
        uint256[] memory credentialIds = _passportCredentials[passportId];
        Credential[] memory result = new Credential[](credentialIds.length);
        
        for (uint i = 0; i < credentialIds.length; i++) {
            result[i] = _credentials[credentialIds[i]];
        }
        
        return result;
    }

    // Revoke a credential (only the issuer or contract owner can do this)
    function revokeCredential(uint256 credentialId) public {
        require(
            msg.sender == _credentials[credentialId].issuer || msg.sender == owner(),
            "Not authorized to revoke"
        );
        
        _credentials[credentialId].isValid = false;
    }
}
