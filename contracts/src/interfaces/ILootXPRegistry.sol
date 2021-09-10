// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

interface ILootXPRegistry {
    function xp(uint256 lootId) external returns (uint256);

    function xpSource(address source) external returns (bool);

    function xpSink(address sink) external returns (bool);

    function xpSourceAndSyncGenerator(address generator) external returns (bool);

    function addXp(uint256 lootId, uint256 amount) external returns (bool);

    function subXp(uint256 lootId, uint256 amount) external returns (bool);

    function setSource(address source, bool add) external;

    function setSink(address sink, bool add) external;

    function setGenerator(address generator, bool add) external;
}
