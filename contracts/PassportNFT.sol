// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Simplified version without LayerZero for demo
contract PassportNFT is ERC721URIStorage, Ownable {
    // Counter for token IDs
    uint256 private _tokenIdCounter;

    // Passport metadata structure
    struct PassportMetadata {
        string name;
        string image;
        address owner;
        uint256 creationTimestamp;
    }

    // Mapping from token ID to passport metadata
    mapping(uint256 => PassportMetadata) private _passportMetadata;

    constructor() ERC721("OmniPass", "PASSPORT") {}

    function mint(string memory name, string memory image, string memory tokenURI) 
        public 
        returns (uint256) 
    {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Set passport metadata
        _passportMetadata[tokenId] = PassportMetadata({
            name: name,
            image: image,
            owner: msg.sender,
            creationTimestamp: block.timestamp
        });

        return tokenId;
    }

    function getPassportMetadata(uint256 tokenId) 
        public 
        view 
        returns (PassportMetadata memory) 
    {
        require(_exists(tokenId), "Passport does not exist");
        return _passportMetadata[tokenId];
    }
}
