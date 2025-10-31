// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint16, externalEuint16} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title ZCraft
/// @notice Stores encrypted grid selections for players using Zama FHEVM.
contract ZCraft is SepoliaConfig {
    mapping(address => euint16) private _encryptedSelections;
    mapping(address => bool) private _hasSelection;

    event SelectionStored(address indexed user);

    error SelectionNotFound(address user);

    /// @notice Saves the encrypted grid selection for the caller.
    /// @param encryptedSelection The encrypted bitmask representing picked cells.
    /// @param inputProof The input proof for the encrypted value.
    function saveSelection(externalEuint16 encryptedSelection, bytes calldata inputProof) external {
        euint16 selection = FHE.fromExternal(encryptedSelection, inputProof);

        _encryptedSelections[msg.sender] = selection;
        _hasSelection[msg.sender] = true;

        FHE.allowThis(selection);
        FHE.allow(selection, msg.sender);

        emit SelectionStored(msg.sender);
    }

    /// @notice Returns the encrypted grid selection for a user.
    /// @param user The address to query.
    /// @return The encrypted grid selection bitmask.
    function getSelection(address user) external view returns (euint16) {
        if (!_hasSelection[user]) {
            revert SelectionNotFound(user);
        }
        return _encryptedSelections[user];
    }

    /// @notice Checks if a user has saved a selection.
    /// @param user The address to query.
    /// @return True if the user has a saved encrypted selection.
    function hasSelection(address user) external view returns (bool) {
        return _hasSelection[user];
    }
}
