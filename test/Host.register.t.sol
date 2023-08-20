// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "forge-std/Test.sol";
import "../src/Host.sol";

contract HostRegisterParentContractTest is Test {
    Host host;
    bytes32 familyID;
    string avatarURI = "https://avatar.com";
    address parent = address(0x0001);
    address parent2 = address(0x0002);
    string username = "passandscore";

    function setUp() public {
        host = new Host();
        familyID = host.hashFamilyId(parent, "familyID");
    }

    function test_RegisterParent() public {
        vm.startPrank(parent);
        host.registerParent(familyID, avatarURI, username);

        assertEq32(host.getFamilyIdByOwner(parent), familyID);
    }

    function test_fetchWhenNoChildrenAreRegistered() public {
        vm.startPrank(parent);
        host.registerParent(familyID, avatarURI, username);

        Host.Child[] memory children = host.fetchChildren(familyID);
        assertEq(children.length, 0);
    }

    function test_revert_registerFamilyWithExisitingFamilyID() public {
        vm.startPrank(parent);
        host.registerParent(familyID, avatarURI, username);

        vm.startPrank(parent2);
        vm.expectRevert(Host.FamilyIdExists.selector);
        host.registerParent(familyID, avatarURI, username);
    }

    function test_revert_registerFamilyWhenAlreadyRegistered() public {
        vm.startPrank(parent);
        host.registerParent(familyID, avatarURI, username);

        vm.expectRevert(Host.AlreadyRegistered.selector);
        host.registerParent(familyID, avatarURI, username);
    }
}
