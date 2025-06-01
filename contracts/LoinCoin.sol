/**
 * - Name:      Hippo Coin
 * - Symbol:    HIP
 * - Standard:  ERC-20
 * - Supply:    500,000 HIP (initial mint to deployer)
 * - Minting:   Only contract owner can mint more
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title HippoCoin
 * @dev ERC20 token with pausable transfers and configurable transfer fee.
 */
contract HippoCoin is ERC20, Ownable, Pausable {
    uint256 public transferFeePercent = 1; // 1% fee by default
    address public feeRecipient;

    constructor(address _feeRecipient) ERC20("Hippo Coin", "HIP") {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
        _mint(msg.sender, 500000 * 10 ** decimals());
    }

    function setTransferFeePercent(uint256 feePercent) external onlyOwner {
        require(feePercent <= 10, "Max 10%");
        transferFeePercent = feePercent;
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid address");
        feeRecipient = newRecipient;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal override whenNotPaused {
        uint256 fee = (amount * transferFeePercent) / 100;
        uint256 amountAfterFee = amount - fee;

        super._transfer(from, feeRecipient, fee);      // Transfer fee to feeRecipient
        super._transfer(from, to, amountAfterFee);     // Transfer remaining to recipient
    }
}

