// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "std-contracts/components/Uint256BareComponent.sol";

uint256 constant ID = uint256(keccak256("component.Upgrades"));

// the number of upgrades on an entity. for kami this is the number of slot
// expansions. for equipment this is the number of upgrade attempts (slots consumed)
contract UpgradesComponent is Uint256BareComponent {
  constructor(address world) Uint256BareComponent(world, ID) {}
}
