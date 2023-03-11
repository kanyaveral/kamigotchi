// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IComponent } from "solecs/interfaces/IComponent.sol";
import { IUint256Component as IUintComp } from "solecs/interfaces/IUint256Component.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { QueryFragment, QueryType } from "solecs/interfaces/Query.sol";
import { LibQuery } from "solecs/LibQuery.sol";
import { getAddressById, getComponentById, entityToAddress, addressToEntity } from "solecs/utils.sol";
import { LibString } from "solady/utils/LibString.sol";

import { HealthComponent, ID as HealthCompID } from "components/HealthComponent.sol";
import { HealthCurrentComponent, ID as HealthCurrentCompID } from "components/HealthCurrentComponent.sol";
import { TimeLastActionComponent, ID as TimeLastActionCompID } from "components/TimeLastActionComponent.sol";
import { BalanceComponent, ID as BalanceCompID } from "components/BalanceComponent.sol";
import { IsFoodComponent, ID as IsFoodCompID } from "components/IsFoodComponent.sol";
import { NameComponent, ID as NameCompID } from "components/NameComponent.sol";

// indexes
import { IndexItemComponent as IndexComp, ID as IndexCompID } from "components/IndexItemComponent.sol";
import { IsRegistryEntryComponent, ID as IsRegistryEntryCompID } from "components/IsRegistryEntryComponent.sol";

// at 150 points, 25h irl. shorten for demo
// uint256 constant epoch = 10 minutes;
uint256 constant epoch = 1 seconds; // 2.5 min cycle for demo

// library for all things battery related! interwoven with LibPet
library LibBattery {
  ///////////////////
  // CAL

  // healthCurrent is held as an arbituary value, no units
  // e.g. cap = 150, epoch = 10 mins,
  //      cur = 150 * timeSinceHealthCurrent (min) / 10 (min)
  // use currHealth to calculate, healthCurrent is *max currHealth*
  function cal(IUintComp components, uint256 petID) internal view returns (uint256) {
    uint256 currHealth = getHealthCurrent(components, petID);
    uint256 lastChar = getLastHealthCurrent(components, petID);

    // amount of currHealth that should be used
    // (time diff) * 10 minutes
    uint256 charUsed = (block.timestamp - lastChar) / epoch;

    if (charUsed >= currHealth) {
      // used up all currHealth, out of battery
      return 0;
    }

    return currHealth - charUsed;
  }

  // returns true if still alive
  function hasHealthCurrent(IUintComp components, uint256 petID) internal view returns (bool) {
    return cal(components, petID) == 0;
  }

  // eat food, update currHealth
  function currHealthBat(
    IUintComp components,
    uint256 petID,
    uint256 toAdd
  ) internal {
    uint256 healthCurrent = getHealth(components, petID);
    uint256 cur = cal(components, petID);

    if (healthCurrent < cur + toAdd) {
      setHealthCurrent(components, petID, healthCurrent);
    } else {
      setHealthCurrent(components, petID, cur + toAdd);
    }

    setLastHealthCurrent(components, petID, block.timestamp);
  }

  ///////////////////
  // FOOD nom nom

  // adds a food item to registry
  function addFoodRegistry(
    IUintComp components,
    IWorld world,
    uint256 index,
    uint256 value,
    string memory name
  ) internal {
    uint256 entityID = world.getUniqueEntityId();

    IsFoodComponent(getAddressById(components, IsFoodCompID)).set(entityID);
    BalanceComponent(getAddressById(components, BalanceCompID)).set(entityID, value);
    NameComponent(getAddressById(components, NameCompID)).set(entityID, name);

    add(components, index, entityID);
  }

  function getFoodValue(IUintComp components, uint256 index) internal view returns (uint256) {
    // no additional check for isFood, but does not affect
    uint256 entityID = get(components, index);
    return BalanceComponent(getAddressById(components, BalanceCompID)).getValue(entityID);
  }

  ///////////////////
  // GETTERS
  function getHealth(IUintComp components, uint256 petID) internal view returns (uint256) {
    return HealthComponent(getAddressById(components, HealthCompID)).getValue(petID);
  }

  function getHealthCurrent(IUintComp components, uint256 petID) internal view returns (uint256) {
    return HealthCurrentComponent(getAddressById(components, HealthCurrentCompID)).getValue(petID);
  }

  function getLastHealthCurrent(IUintComp components, uint256 petID)
    internal
    view
    returns (uint256)
  {
    return
      TimeLastActionComponent(getAddressById(components, TimeLastActionCompID)).getValue(petID);
  }

  ///////////////////
  // SETTERS
  function setHealth(
    IUintComp components,
    uint256 petID,
    uint256 value
  ) internal {
    HealthComponent(getAddressById(components, HealthCompID)).set(petID, value);
  }

  function setHealthCurrent(
    IUintComp components,
    uint256 petID,
    uint256 value
  ) internal {
    HealthCurrentComponent(getAddressById(components, HealthCurrentCompID)).set(petID, value);
  }

  function setLastHealthCurrent(
    IUintComp components,
    uint256 petID,
    uint256 value
  ) internal {
    TimeLastActionComponent(getAddressById(components, TimeLastActionCompID)).set(petID, value);
  }

  ///////////////////////
  // REGISTRY (to be depreciated)

  // returns entity at registry
  function get(IUintComp components, uint256 index) internal view returns (uint256) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(
      QueryType.Has,
      getComponentById(components, IsRegistryEntryCompID),
      new bytes(0)
    );
    fragments[1] = QueryFragment(
      QueryType.HasValue,
      getComponentById(components, IndexCompID),
      abi.encode(index)
    );

    uint256[] memory results = LibQuery.query(fragments);

    require(results.length == 1, "index does not exist in registry");
    // hardcoded to first index. should not create multiple indexes with same id
    // create custom component for this?
    return results[0];
  }

  function add(
    IUintComp components,
    uint256 index,
    uint256 entityToAdd
  ) internal {
    // no check
    IndexComp comp = IndexComp(getAddressById(components, IndexCompID));
    IsRegistryEntryComponent isComp = IsRegistryEntryComponent(
      getAddressById(components, IsRegistryEntryCompID)
    );
    comp.set(entityToAdd, index);
    isComp.set(entityToAdd);
  }
}
