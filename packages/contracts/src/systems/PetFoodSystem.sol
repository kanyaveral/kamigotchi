// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { System } from "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";

import { LibInventory } from "libraries/LibInventory.sol";
import { LibOperator } from "libraries/LibOperator.sol";
import { LibPet } from "libraries/LibPet.sol";

uint256 constant ID = uint256(keccak256("system.Pet.Food"));

// eat one snack
contract PetFoodSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public onlyOwner returns (bytes memory) {
    (uint256 petID, uint256 foodIndex) = abi.decode(arguments, (uint256, uint256));
    uint256 operatorID = LibOperator.getByAddress(components, msg.sender);
    uint256 inventoryID = LibInventory.get(components, operatorID, foodIndex);

    require(LibPet.getOperator(components, petID) == operatorID, "Pet: not urs");
    require(inventoryID != 0, "Inventory: no food");

    LibInventory.dec(components, inventoryID, 1); // inherent check for insufficient balance
    LibPet.feed(components, petID, foodIndex);
    return "";
  }

  function executeTyped(uint256 petID, uint256 foodIndex) public onlyOwner returns (bytes memory) {
    return execute(abi.encode(petID, foodIndex));
  }
}
