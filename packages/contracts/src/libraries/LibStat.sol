// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IUint256Component, IUint256Component as IComponents } from "solecs/interfaces/IUint256Component.sol";
import { getAddressById, getComponentById } from "solecs/utils.sol";

import { CapacityComponent, ID as CapacityCompID } from "components/CapacityComponent.sol";
import { HarmonyComponent, ID as HarmonyCompID } from "components/HarmonyComponent.sol";
import { NumSlotsBaseComponent, ID as NumSlotsBaseCompID } from "components/NumSlotsBaseComponent.sol";
import { NumSlotsUpgradesComponent, ID as NumSlotsUpgradesCompID } from "components/NumSlotsUpgradesComponent.sol";
import { PowerComponent, ID as PowerCompID } from "components/PowerComponent.sol";
import { ViolenceComponent, ID as ViolenceCompID } from "components/ViolenceComponent.sol";

// LibStat manages the retrieval and update of stats. This library differs from
// others in the sense that it does not manage a single entity type, but rather
// any entity that can have stats. Only handles uint256 components.
library LibStat {
  /////////////////
  // INTERACTIONS

  // Copy the set stats from one entity to another.
  function copy(
    IComponents components,
    uint256 fromID,
    uint256 toID
  ) internal {
    uint256[] memory componentIDs = getComponentsSet(components, fromID);
    for (uint256 i = 0; i < componentIDs.length; i++) {
      uint256 val = IUint256Component(getAddressById(components, componentIDs[i])).getValue(fromID);
      IUint256Component(getAddressById(components, componentIDs[i])).set(toID, val);
    }
  }

  // Wipe all set stats from an entity.
  function wipe(IComponents components, uint256 id) internal {
    uint256[] memory componentIDs = getComponentsSet(components, id);
    for (uint256 i = 0; i < componentIDs.length; i++) {
      getComponentById(components, componentIDs[i]).remove(id);
    }
  }

  /////////////////
  // CHECKERS

  function hasPower(IComponents components, uint256 id) internal view returns (bool) {
    return PowerComponent(getAddressById(components, PowerCompID)).has(id);
  }

  function hasCapacity(IComponents components, uint256 id) internal view returns (bool) {
    return CapacityComponent(getAddressById(components, CapacityCompID)).has(id);
  }

  function hasHarmony(IComponents components, uint256 id) internal view returns (bool) {
    return HarmonyComponent(getAddressById(components, HarmonyCompID)).has(id);
  }

  function hasViolence(IComponents components, uint256 id) internal view returns (bool) {
    return ViolenceComponent(getAddressById(components, ViolenceCompID)).has(id);
  }

  function hasNumSlotsBase(IComponents components, uint256 id) internal view returns (bool) {
    return NumSlotsBaseComponent(getAddressById(components, NumSlotsBaseCompID)).has(id);
  }

  function hasNumSlotsUpgrades(IComponents components, uint256 id) internal view returns (bool) {
    return NumSlotsUpgradesComponent(getAddressById(components, NumSlotsUpgradesCompID)).has(id);
  }

  /////////////////
  // GETTERS

  // Get all the component IDs of an entity's set stats. NumSlots components are included
  // with upgradable equipment in mind.
  function getComponentsSet(IComponents components, uint256 id)
    internal
    view
    returns (uint256[] memory)
  {
    uint256 statCount;
    if (hasPower(components, id)) statCount++;
    if (hasCapacity(components, id)) statCount++;
    if (hasHarmony(components, id)) statCount++;
    if (hasViolence(components, id)) statCount++;
    if (hasNumSlotsBase(components, id)) statCount++;
    if (hasNumSlotsUpgrades(components, id)) statCount++;

    uint256 i;
    uint256[] memory statComponents = new uint256[](statCount);
    if (hasPower(components, id)) statComponents[i++] = PowerCompID;
    if (hasCapacity(components, id)) statComponents[i++] = CapacityCompID;
    if (hasHarmony(components, id)) statComponents[i++] = HarmonyCompID;
    if (hasViolence(components, id)) statComponents[i++] = ViolenceCompID;
    if (hasNumSlotsBase(components, id)) statComponents[i++] = NumSlotsBaseCompID;
    if (hasNumSlotsUpgrades(components, id)) statComponents[i++] = NumSlotsUpgradesCompID;
    return statComponents;
  }

  function getPower(IComponents components, uint256 id) internal view returns (uint256) {
    return PowerComponent(getAddressById(components, PowerCompID)).getValue(id);
  }

  function getCapacity(IComponents components, uint256 id) internal view returns (uint256) {
    return CapacityComponent(getAddressById(components, CapacityCompID)).getValue(id);
  }

  function getHarmony(IComponents components, uint256 id) internal view returns (uint256) {
    return HarmonyComponent(getAddressById(components, HarmonyCompID)).getValue(id);
  }

  function getViolence(IComponents components, uint256 id) internal view returns (uint256) {
    return ViolenceComponent(getAddressById(components, ViolenceCompID)).getValue(id);
  }

  function getNumSlotsBase(IComponents components, uint256 id) internal view returns (uint256) {
    return NumSlotsBaseComponent(getAddressById(components, NumSlotsBaseCompID)).getValue(id);
  }

  function getNumSlotsUpgrades(IComponents components, uint256 id) internal view returns (uint256) {
    return
      NumSlotsUpgradesComponent(getAddressById(components, NumSlotsUpgradesCompID)).getValue(id);
  }

  /////////////////
  // SETTERS

  function setPower(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    PowerComponent(getAddressById(components, PowerCompID)).set(id, value);
  }

  function setCapacity(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    CapacityComponent(getAddressById(components, CapacityCompID)).set(id, value);
  }

  function setHarmony(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    HarmonyComponent(getAddressById(components, HarmonyCompID)).set(id, value);
  }

  function setViolence(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    ViolenceComponent(getAddressById(components, ViolenceCompID)).set(id, value);
  }

  function setNumSlotsBase(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    NumSlotsBaseComponent(getAddressById(components, NumSlotsBaseCompID)).set(id, value);
  }

  function setNumSlotsUpgrades(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    NumSlotsUpgradesComponent(getAddressById(components, NumSlotsUpgradesCompID)).set(id, value);
  }
}
