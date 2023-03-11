// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IUint256Component, IUint256Component as IComponents } from "solecs/interfaces/IUint256Component.sol";
import { getAddressById, getComponentById } from "solecs/utils.sol";

import { HealthComponent, ID as HealthCompID } from "components/HealthComponent.sol";
import { HarmonyComponent, ID as HarmonyCompID } from "components/HarmonyComponent.sol";
import { SlotsComponent, ID as SlotsCompID } from "components/SlotsComponent.sol";
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

  function hasHarmony(IComponents components, uint256 id) internal view returns (bool) {
    return HarmonyComponent(getAddressById(components, HarmonyCompID)).has(id);
  }

  function hasHealth(IComponents components, uint256 id) internal view returns (bool) {
    return HealthComponent(getAddressById(components, HealthCompID)).has(id);
  }

  function hasPower(IComponents components, uint256 id) internal view returns (bool) {
    return PowerComponent(getAddressById(components, PowerCompID)).has(id);
  }

  function hasSlots(IComponents components, uint256 id) internal view returns (bool) {
    return SlotsComponent(getAddressById(components, SlotsCompID)).has(id);
  }

  function hasViolence(IComponents components, uint256 id) internal view returns (bool) {
    return ViolenceComponent(getAddressById(components, ViolenceCompID)).has(id);
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
    if (hasHealth(components, id)) statCount++;
    if (hasHarmony(components, id)) statCount++;
    if (hasViolence(components, id)) statCount++;
    if (hasSlots(components, id)) statCount++;

    uint256 i;
    uint256[] memory statComponents = new uint256[](statCount);
    if (hasPower(components, id)) statComponents[i++] = PowerCompID;
    if (hasHealth(components, id)) statComponents[i++] = HealthCompID;
    if (hasHarmony(components, id)) statComponents[i++] = HarmonyCompID;
    if (hasViolence(components, id)) statComponents[i++] = ViolenceCompID;
    if (hasSlots(components, id)) statComponents[i++] = SlotsCompID;
    return statComponents;
  }

  function getHarmony(IComponents components, uint256 id) internal view returns (uint256) {
    return HarmonyComponent(getAddressById(components, HarmonyCompID)).getValue(id);
  }

  function getHealth(IComponents components, uint256 id) internal view returns (uint256) {
    return HealthComponent(getAddressById(components, HealthCompID)).getValue(id);
  }

  function getPower(IComponents components, uint256 id) internal view returns (uint256) {
    return PowerComponent(getAddressById(components, PowerCompID)).getValue(id);
  }

  function getSlots(IComponents components, uint256 id) internal view returns (uint256) {
    return SlotsComponent(getAddressById(components, SlotsCompID)).getValue(id);
  }

  function getViolence(IComponents components, uint256 id) internal view returns (uint256) {
    return ViolenceComponent(getAddressById(components, ViolenceCompID)).getValue(id);
  }

  /////////////////
  // SETTERS

  function setHarmony(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    HarmonyComponent(getAddressById(components, HarmonyCompID)).set(id, value);
  }

  function setHealth(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    HealthComponent(getAddressById(components, HealthCompID)).set(id, value);
  }

  function setPower(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    PowerComponent(getAddressById(components, PowerCompID)).set(id, value);
  }

  function setSlots(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    SlotsComponent(getAddressById(components, SlotsCompID)).set(id, value);
  }

  function setViolence(
    IComponents components,
    uint256 id,
    uint256 value
  ) internal {
    ViolenceComponent(getAddressById(components, ViolenceCompID)).set(id, value);
  }
}
