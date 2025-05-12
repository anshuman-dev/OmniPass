// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleIdentityPassport
 * @dev A simplified version of our identity contract for testing deployment
 */
contract SimpleIdentityPassport is Ownable {
    // Storage for verified users
    mapping(address => bool) public verifiedUsers;
    
    // Event for tracking verifications
    event UserVerified(address user, uint256 timestamp);

    constructor(address _owner) Ownable(_owner) {}

    /**
     * @notice Verifies a user's identity locally on this chain
     * @param _user Address of the user to verify
     */
    function verifyUser(address _user) external onlyOwner {
        verifiedUsers[_user] = true;
        emit UserVerified(_user, block.timestamp);
    }
    
    /**
     * @notice Checks if a user is verified
     * @param _user Address of the user to check
     * @return bool True if the user is verified, false otherwise
     */
    function isVerified(address _user) external view returns (bool) {
        return verifiedUsers[_user];
    }
}