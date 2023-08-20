// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "../src/Host.sol";

contract HostScript is Script {
    function setUp() public {}

    function run() public {
        uint privateKey = vm.envUint("DEV_PRIV_KEY");

        vm.startBroadcast(privateKey);
        //deploy contract
        Host host = new Host();
        vm.stopBroadcast();
    }
}
