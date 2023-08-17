// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/Host.sol";

contract HostContractTest is Test {
    Host host;
    bytes32 familyID;
    bytes32 incorrectFamilyID;
    string avatarURI = "https://avatar.com";
    string updatedAvatarURI = "https://avatar.com/updated";
    string username = "passandscore";
    string updatedUsername = "passandscore_updated";
    bool sandboxMode = false;
    address parent = address(0x0001);
    address child1 = address(0x0002);
    address child2 = address(0x0003);
    address notRegistered = address(0x0004);
    address parent2 = address(0x0005);

    function setUp() public {
        host = new Host();
        familyID = host.hashFamilyId(parent, "familyID");
        incorrectFamilyID = host.hashFamilyId(parent, "incorrectFamilyID");

        vm.startPrank(parent);
        host.registerParent(familyID, avatarURI, username);
    }

    function testFail_getParentId() public {
        assertEq32(host.getFamilyIdByOwner(parent), incorrectFamilyID);
    }

    function test_updateAvatarURI() public {
        // non-empty string
        host.updateAvatarURI(updatedAvatarURI);
        assertEq(host.getFamilyByOwner(parent).avatarURI, updatedAvatarURI);

        // empty string
        host.updateAvatarURI("");
        assertEq(host.getFamilyByOwner(parent).avatarURI, "");
    }

    function test_updateChildAvatarURI() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);
        assertEq(host.fetchChild(child1, familyID).avatarURI, avatarURI);

        Host.Child memory fetchedChild = host.fetchChild(child1, familyID);

        vm.startPrank(child1);
        host.updateChildAvatarURI(
            familyID,
            fetchedChild.wallet,
            updatedAvatarURI
        );

        vm.startPrank(parent);
        assertEq(host.fetchChild(child1, familyID).avatarURI, updatedAvatarURI);
    }

    function test_revert_wrongUserUpdateAvatarURI() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);

        vm.startPrank(child1);

        vm.expectRevert(Host.ParentOnly.selector);
        host.updateAvatarURI(updatedAvatarURI);
    }

    function test_revert_wrongUserUpdateChildAvatarURI() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);
        assertEq(host.fetchChild(child1, familyID).avatarURI, avatarURI);

        Host.Child memory fetchedChild = host.fetchChild(child1, familyID);

        vm.startPrank(notRegistered);

        vm.expectRevert(Host.NotFamilyMember.selector);
        host.updateChildAvatarURI(
            familyID,
            fetchedChild.wallet,
            updatedAvatarURI
        );
    }

    function test_addChild() public {
        assertEq(host.getFamilyByOwner(parent).children.length, 0);

        host.addChild(familyID, username, avatarURI, child1, sandboxMode);

        assertEq(host.getFamilyByOwner(parent).children.length, 1);
    }

    function test_revert_addAlreadyRegisteredChild() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);

        vm.expectRevert(Host.AlreadyRegistered.selector);
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);
    }

    function test_fetchChild() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);

        assertEq(host.fetchChild(child1, familyID).wallet, child1);
    }

    function test_revert_fetchUnregisteredChild() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);

        vm.expectRevert(Host.NotRegistered.selector);
        host.fetchChild(child2, familyID);
    }

    function test_fetchChildren() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);
        host.addChild(familyID, username, avatarURI, child2, sandboxMode);

        Host.Child[] memory children = host.fetchChildren(familyID);

        assertEq(children.length, 2);
        assertEq(children[0].wallet, child1);
        assertEq(children[1].wallet, child2);
    }

    function test_toggleSandboxMode() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);

        assertEq(host.fetchChild(child1, familyID).sandboxMode, false);

        host.toggleSandbox(child1, familyID);

        assertEq(host.fetchChild(child1, familyID).sandboxMode, true);
    }

    function test_revert_toggleSandboxMode() public {
        vm.expectRevert(Host.NotRegistered.selector);
        host.toggleSandbox(child1, familyID);
    }

    function test_hashFamilyId() public view {
        assert(
            host.getFamilyByOwner(parent).familyId ==
                host.hashFamilyId(parent, "familyID")
        );
    }

    function test_getUserType() public {
        vm.startPrank(parent);
        assertEq(host.getUserType(parent), uint24(Host.UserType.Parent));

        host.addChild(familyID, username, avatarURI, child1, sandboxMode);

        vm.startPrank(child1);
        assertEq(host.getUserType(child1), uint24(Host.UserType.Child));
    }

    function test_updateUsername() public {
        // non-empty string
        host.updateUsername(updatedUsername);
        assertEq(host.getFamilyByOwner(parent).username, updatedUsername);

        // empty string
        host.updateUsername("");
        assertEq(host.getFamilyByOwner(parent).username, "");
    }

    function test_updateChildUsername() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);
        assertEq(host.fetchChild(child1, familyID).username, username);

        // parent changes the username
        Host.Child memory fetchedChild = host.fetchChild(child1, familyID);
        host.updateChildUsername(
            familyID,
            fetchedChild.wallet,
            updatedUsername
        );
        assertEq(host.fetchChild(child1, familyID).username, updatedUsername);

        // child sets username back to original
        vm.startPrank(child1);

        host.updateChildUsername(familyID, fetchedChild.wallet, username);

        vm.startPrank(parent);
        assertEq(host.fetchChild(child1, familyID).username, username);
    }

    function test_revert_wrongUserUpdateUsername() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);

        vm.startPrank(child1);

        vm.expectRevert(Host.ParentOnly.selector);
        host.updateUsername(updatedUsername);
    }

    function test_revert_updateChildUsername() public {
        host.addChild(familyID, username, avatarURI, child1, sandboxMode);
        Host.Child memory fetchedChild = host.fetchChild(child1, familyID);

        vm.startPrank(notRegistered);
        vm.expectRevert(Host.NotFamilyMember.selector);
        host.updateChildUsername(
            familyID,
            fetchedChild.wallet,
            updatedUsername
        );
    }

    function test_updateFamilyId() public {
        // proof ID is set
        vm.expectRevert(Host.AlreadyRegistered.selector);
        host.registerParent(familyID, avatarURI, username);

        host.addChild(familyID, username, avatarURI, child1, sandboxMode);
        host.addChild(familyID, username, avatarURI, child2, sandboxMode);

        Host.Child[] memory childrenBefore = host.fetchChildren(familyID);

        assertEq(childrenBefore[0].familyId, familyID);
        assertEq(childrenBefore[1].familyId, familyID);

        string memory updatedFamilyID = "updatedID";
        bytes32 updatedFamilyIDHash = host.hashFamilyId(
            parent,
            updatedFamilyID
        );
        host.updateFamilyId(parent, familyID, updatedFamilyIDHash);

        assertEq(host.getFamilyByOwner(parent).familyId, updatedFamilyIDHash);

        Host.Child[] memory children = host.fetchChildren(updatedFamilyIDHash);

        assertEq(children[0].familyId, updatedFamilyIDHash);
        assertEq(children[1].familyId, updatedFamilyIDHash);

        vm.startPrank(parent2);
        host.registerParent(familyID, avatarURI, username);
        assertEq(host.getFamilyByOwner(parent2).familyId, familyID);
    }
}
