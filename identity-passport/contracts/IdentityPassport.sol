// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OApp, MessagingFee, Origin } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { MessagingReceipt } from "@layerzerolabs/oapp-evm/contracts/oapp/OAppSender.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";

/**
 * @title IdentityPassport
 * @dev A cross-chain identity verification contract that allows users to create
 * and propagate their verified identity status across multiple blockchains.
 */
contract IdentityPassport is OApp, OAppOptionsType3 {
    // Constants for message types
    uint16 public constant VERIFICATION_MESSAGE = 1;
    
    // Storage for verified users
    mapping(address => bool) public verifiedUsers;
    
    // Event for tracking verifications
    event UserVerified(address user, uint256 timestamp);
    
    // Event for tracking verification propagation
    event VerificationPropagated(address user, uint32 dstEid, bytes32 guid);

    constructor(address _endpoint, address _delegate) OApp(_endpoint, _delegate) Ownable(_delegate) {}

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

    /**
     * @notice Propagates a user's verification status to another chain
     * @param _user Address of the user to propagate verification for
     * @param _dstEid Destination endpoint ID
     * @param _options Additional options for message execution
     */
    function propagateVerification(
        address _user, 
        uint32 _dstEid,
        bytes calldata _options
    ) external payable {
        // Check if user is already verified locally
        require(verifiedUsers[_user], "User not verified locally");
        
        // Prepare the payload with the user's address
        bytes memory payload = abi.encode(_user);
        
        // Get options with enforced parameters for this message type
        bytes memory options = combineOptions(_dstEid, VERIFICATION_MESSAGE, _options);
        
        // Send the cross-chain message
        MessagingReceipt memory receipt = _lzSend(
            _dstEid,
            payload,
            options,
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );
        
        emit VerificationPropagated(_user, _dstEid, receipt.guid);
    }
    
    /**
     * @notice Quote the fee for propagating verification to another chain
     * @param _dstEid Destination endpoint ID
     * @param _options Execution options for the message
     * @return fee The MessagingFee struct containing the native fee
     */
    function quotePropagateFee(
        uint32 _dstEid,
        bytes calldata _options
    ) external view returns (MessagingFee memory fee) {
        // Encode a dummy user address for the quote
        bytes memory payload = abi.encode(address(0));
        
        // Combine with enforced options
        bytes memory options = combineOptions(_dstEid, VERIFICATION_MESSAGE, _options);
        
        // Get the message fee
        fee = _quote(_dstEid, payload, options, false);
    }

    /**
 * @notice Receives a message from another chain to update verification status
 * @dev This is called by the LayerZero endpoint when a message is received
 */
function _lzReceive(
    Origin calldata /* _origin */,
    bytes32 /* _guid */,
    bytes calldata _message,
    address, // executor
    bytes calldata // extraData
) internal override {
    // Extract the user address from the message
    address user = abi.decode(_message, (address));
    
    // Update verification status
    verifiedUsers[user] = true;
    
    // Emit event
    emit UserVerified(user, block.timestamp);
}
}