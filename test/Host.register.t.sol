// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "forge-std/Test.sol";
import "../src/Host.sol";

contract HostRegisterParentContractTest is Test {
    Host host;
    bytes32 familyID;
    string avatarURI = "https://avatar.com";
    address parent = address(0x0001);

    function setUp() public {
        host = new Host();
        familyID = host.hashFamilyId(parent, "familyID");
    }

    function test_RegisterParent() public {
        vm.startPrank(parent);
        host.registerParent(familyID, avatarURI);

        assertEq32(host.getFamilyIdByOwner(parent), familyID);
    }
}
