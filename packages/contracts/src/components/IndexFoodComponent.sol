// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "std-contracts/components/Uint256Component.sol";

uint256 constant ID = uint256(keccak256("component.Index.Food"));

// represents the human-set Food Index on a Registry entity
contract IndexFoodComponent is Uint256Component {
  constructor(address world) Uint256Component(world, ID) {}
}
