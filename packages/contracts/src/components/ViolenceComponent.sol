// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "std-contracts/components/Uint256BareComponent.sol";

uint256 constant ID = uint256(keccak256("component.Violence"));

// Violence stat of a kami, equip or mod. Violence allows a kami to reap others
// at higher energy capacities.
contract ViolenceComponent is Uint256BareComponent {
  constructor(address world) Uint256BareComponent(world, ID) {}
}
