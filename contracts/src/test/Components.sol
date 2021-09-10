// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.8.7;

contract Components {
    function test(uint256 tokenId) external pure returns (string memory loot, string memory syntheticLoot) {
        string memory keyPrefix = "WEAPON";
        loot = string(abi.encodePacked(keyPrefix, toString(tokenId)));

        address walletAddress = address(uint160(tokenId));
        syntheticLoot = string(abi.encodePacked(keyPrefix, abi.encodePacked(walletAddress)));
    }


    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
