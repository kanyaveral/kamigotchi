// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { LibString } from "solady/utils/LibString.sol";
import { IComponent } from "solecs/interfaces/IComponent.sol";
import { IUint256Component as IUintComp } from "solecs/interfaces/IUint256Component.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, getComponentById, entityToAddress, addressToEntity } from "solecs/utils.sol";

import { IdOperatorComponent, ID as IdOpCompID } from "components/IdOperatorComponent.sol";
import { IdOwnerComponent, ID as IdOwnerCompID } from "components/IdOwnerComponent.sol";
import { IndexPetComponent, ID as IndexPetComponentID } from "components/IndexPetComponent.sol";
import { IsPetComponent, ID as IsPetCompID } from "components/IsPetComponent.sol";
import { PowerComponent, ID as PowerCompID } from "components/PowerComponent.sol";
import { HealthComponent, ID as HealthCompID } from "components/HealthComponent.sol";
import { HealthCurrentComponent, ID as HealthCurrentCompID } from "components/HealthCurrentComponent.sol";
import { MediaURIComponent, ID as MediaURICompID } from "components/MediaURIComponent.sol";
import { NameComponent, ID as NameCompID } from "components/NameComponent.sol";
import { TimeLastActionComponent, ID as TimeLastCompID } from "components/TimeLastActionComponent.sol";
import { LibModifier } from "libraries/LibModifier.sol";
import { LibProduction } from "libraries/LibProduction.sol";

uint256 constant BASE_HEALTH = 150;
uint256 constant BASE_POWER = 150;
uint256 constant PROD_EPOCH = 600; // 10min

uint256 constant DEMO_POWER = 15;
uint256 constant DEMO_EPOCH = 1;

library LibPet {
  /////////////////
  // INTERACTIONS

  // create a pet entity, set its owner and operator for an entity
  // NOTE: we may need to create an Operator/Owner entities here if they dont exist
  // TODO: include attributes in this generation
  function create(
    IWorld world,
    IUintComp components,
    address owner,
    uint256 operatorID,
    uint256 index,
    string memory uri
  ) internal returns (uint256) {
    uint256 id = world.getUniqueEntityId();
    IsPetComponent(getAddressById(components, IsPetCompID)).set(id);
    IndexPetComponent(getAddressById(components, IndexPetComponentID)).set(id, index);
    IdOwnerComponent(getAddressById(components, IdOwnerCompID)).set(id, addressToEntity(owner));
    IdOperatorComponent(getAddressById(components, IdOpCompID)).set(id, operatorID);
    MediaURIComponent(getAddressById(components, MediaURICompID)).set(id, uri);
    TimeLastActionComponent(getAddressById(components, TimeLastCompID)).set(id, block.timestamp);

    string memory name = LibString.concat("kamigotchi ", LibString.toString(index));
    NameComponent(getAddressById(components, NameCompID)).set(id, name);

    return id;
  }

  // update the battery currHealth of a pet based on its timestamp and currHealth at last action.
  // NOTE: if the returned currHealth is 0 we should make sure the pet dies
  // NOTE: should be called at the top of a System and folllowed up with a require(!isDead)
  function updateHealthCurrent(IUintComp components, uint256 id)
    internal
    returns (uint256 newHealthCurrent)
  {
    uint256 lastTs = getLastTs(components, id);
    uint256 duration = block.timestamp - lastTs;
    // uint256 drain = (duration + PROD_EPOCH - 1) / PROD_EPOCH; // round up on drainage
    uint256 drain = (duration + DEMO_EPOCH - 1) / DEMO_EPOCH; // round up on drainage
    uint256 prevHealthCurrent = getHealthCurrent(components, id);

    newHealthCurrent = (prevHealthCurrent > drain) ? prevHealthCurrent - drain : 0;
    setHealthCurrent(components, id, newHealthCurrent);
    setLastTs(components, id, block.timestamp);
  }

  /////////////////
  // SETTERS

  // set a pet's stats from its traits
  // TODO: actually set stats from traits. hardcoded currently
  function setStats(IUintComp components, uint256 id) internal {
    PowerComponent(getAddressById(components, PowerCompID)).set(id, DEMO_POWER);
    // PowerComponent(getAddressById(components, PowerCompID)).set(id, BASE_POWER);

    uint256 totalHealth = BASE_HEALTH;
    HealthComponent(getAddressById(components, HealthCompID)).set(id, smolRandom(totalHealth, id));
    HealthCurrentComponent(getAddressById(components, HealthCurrentCompID)).set(
      id,
      smolRandom(totalHealth, id)
    );
  }

  // temporary function to stimulate a little randomness
  function smolRandom(uint256 base, uint256 seed) internal pure returns (uint256) {
    return (base / 2) + (uint256(keccak256(abi.encode(seed, base))) % base);
  }

  function setHealthCurrent(
    IUintComp components,
    uint256 id,
    uint256 currHealth
  ) internal {
    HealthCurrentComponent(getAddressById(components, HealthCurrentCompID)).set(id, currHealth);
  }

  // Update the TimeLastAction of a pet. used to expected battery drain on next action
  function setLastTs(
    IUintComp components,
    uint256 id,
    uint256 ts
  ) internal {
    TimeLastActionComponent(getAddressById(components, TimeLastCompID)).set(id, ts);
  }

  function setName(
    IUintComp components,
    uint256 id,
    string memory name
  ) internal {
    NameComponent(getAddressById(components, NameCompID)).set(id, name);
  }

  function setOperator(
    IUintComp components,
    uint256 id,
    uint256 operatorID
  ) internal {
    IdOperatorComponent(getAddressById(components, IdOpCompID)).set(id, operatorID);
  }

  function setOwner(
    IUintComp components,
    uint256 id,
    uint256 ownerID
  ) internal {
    IdOwnerComponent(getAddressById(components, IdOwnerCompID)).set(id, ownerID);
  }

  /////////////////
  // CHECKS

  function isPet(IUintComp components, uint256 id) internal view returns (bool) {
    return IsPetComponent(getAddressById(components, IsPetCompID)).has(id);
  }

  function isDead(IUintComp components, uint256 id) internal view returns (bool) {
    return getHealthCurrent(components, id) == 0;
  }

  // Check whether a pet has an ongoing production.
  function isProducing(IUintComp components, uint256 id) internal view returns (bool result) {
    uint256[] memory results = LibProduction._getAllX(components, 0, id, "ACTIVE");
    if (results.length > 0) {
      result = true;
    }
  }

  /////////////////
  // CALCULATIONS

  // calculate and return the total power of a pet (including equipment)
  // TODO: include equipment stats
  // TODO: update this to power, soon:tm:
  function getTotalPower(IUintComp components, uint256 id) internal view returns (uint256) {
    return PowerComponent(getAddressById(components, PowerCompID)).getValue(id);
  }

  // calculate and return the total battery healthCurrent of a pet (including equipment)
  // TODO: include equipment stats
  function getTotalHealth(IUintComp components, uint256 id) internal view returns (uint256) {
    return HealthComponent(getAddressById(components, HealthCompID)).getValue(id);
  }

  /////////////////
  // COMPONENT RETRIEVAL

  function getHealthCurrent(IUintComp components, uint256 id) internal view returns (uint256) {
    return HealthCurrentComponent(getAddressById(components, HealthCurrentCompID)).getValue(id);
  }

  function getLastTs(IUintComp components, uint256 id) internal view returns (uint256) {
    return TimeLastActionComponent(getAddressById(components, TimeLastCompID)).getValue(id);
  }

  function getName(IUintComp components, uint256 id) internal view returns (string memory) {
    return NameComponent(getAddressById(components, NameCompID)).getValue(id);
  }

  function getMediaURI(IUintComp components, uint256 id) internal view returns (string memory) {
    return MediaURIComponent(getAddressById(components, MediaURICompID)).getValue(id);
  }

  // get the entity ID of the pet operator
  function getOperator(IUintComp components, uint256 id) internal view returns (uint256) {
    return IdOperatorComponent(getAddressById(components, IdOpCompID)).getValue(id);
  }

  // get the entity ID of the pet owner
  function getOwner(IUintComp components, uint256 id) internal view returns (uint256) {
    return IdOwnerComponent(getAddressById(components, IdOwnerCompID)).getValue(id);
  }

  /////////////////
  // QUERIES

  // get the entity ID of a pet from its index (tokenID)
  function indexToID(IUintComp components, uint256 index) internal view returns (uint256 result) {
    uint256[] memory results = IndexPetComponent(getAddressById(components, IndexPetComponentID))
      .getEntitiesWithValue(index);
    if (results.length > 0) {
      result = results[0];
    }
  }

  // get tokenID from entity
  function entityToIndex(IUintComp components, uint256 entityID) internal view returns (uint256) {
    return IndexPetComponent(getAddressById(components, IndexPetComponentID)).getValue(entityID);
  }

  // Get the production of a pet. Return 0 if there are none.
  function getProduction(IUintComp components, uint256 id) internal view returns (uint256 result) {
    uint256[] memory results = LibProduction._getAllX(components, 0, id, "");
    if (results.length > 0) {
      result = results[0];
    }
  }

  /////////////////
  // ERC721

  // transfer ERC721 pet
  // NOTE: it doesnt seem we actually need IdOwner directly on the pet as it can be
  // directly accessed through the operator entity.
  function transfer(
    IUintComp components,
    uint256 index,
    uint256 operatorID
  ) internal {
    // does not need to check for previous owner, ERC721 handles it
    uint256 id = indexToID(components, index);
    uint256 ownerID = getOwner(components, operatorID);

    setOwner(components, id, ownerID);
    setOperator(components, id, operatorID);
  }

  // return whether owner or operator
  function isOwnerOrOperator(
    IUintComp components,
    uint256 id,
    address sender
  ) internal view returns (bool) {
    uint256 senderAsID = addressToEntity(sender);
    return getOwner(components, id) == senderAsID || getOperator(components, id) == senderAsID;
  }
}
