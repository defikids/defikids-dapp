// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Staking Token (STK)
 * @author Jason Schwarz
 * @notice Implements a basic ERC20 staking token with incentive distribution.
 */
contract AllocateStakingToken is ERC20, Ownable {
    address[] internal stakeholders;

    mapping(address => uint256) internal stakes; // The stakes for each stakeholder.
    mapping(address => uint256) internal rewards; // The accumulated rewards for each stakeholder.

    constructor(string memory _name, string memory _symbol, uint256 initialSupply) ERC20(_name, _symbol) {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @notice A method to check if an address is a stakeholder.
     * @param _address The address to verify.
     * @return bool, uint256 Whether the address is a stakeholder,
     * and if so its position in the stakeholders array.
     */
    function isStakeholder(address _address)
        public
        view
        returns (bool, uint256)
    {
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            if (_address == stakeholders[s]) return (true, s);
        }
        return (false, 0);
    }

    /**
     * @notice A method to add a stakeholder.
     * @param _stakeholder The stakeholder to add.
     */
    function addStakeholder(address _stakeholder) public {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if (!_isStakeholder) stakeholders.push(_stakeholder);
    }

    /**
     * @notice A method to remove a stakeholder.
     * @param _stakeholder The stakeholder to remove.
     */
    function removeStakeholder(address _stakeholder) public {
        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
        if (_isStakeholder) {
            require(
                stakes[_stakeholder] == 0,
                "Must withdraw your stake first"
            );
            require(
                rewards[_stakeholder] == 0,
                "Must withdraw your rewards first"
            );
            stakeholders[s] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
        }
    }

    /**
     * @notice A method to retrieve the stake for a stakeholder.
     * @param _stakeholder The stakeholder to retrieve the stake for.
     * @return uint256 The amount of wei staked.
     */
    function stakeOf(address _stakeholder) public view returns (uint256) {
        return stakes[_stakeholder];
    }

    /**
     * @notice A method to the aggregated stakes from all stakeholders.
     * @return uint256 The aggregated stakes from all stakeholders.
     */
    function totalStakes() public view returns (uint256) {
        uint256 _totalStakes = 0;
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            _totalStakes = _totalStakes += stakes[stakeholders[s]];
        }
        return _totalStakes;
    }

    /**
     * @notice A method for a stakeholder to create a stake.
     * @param _stake The size of the stake to be created.
     */
    function createStake(uint256 _stake) public {
        _burn(msg.sender, _stake);
        if (stakes[msg.sender] == 0) addStakeholder(msg.sender);
        stakes[msg.sender] = stakes[msg.sender] + _stake;
    }

    /**
     * @notice A method for a stakeholder to remove a stake.
     * @param _stake The size of the stake to be removed.
     */
    function removeStake(uint256 _stake) public {
        stakes[msg.sender] = stakes[msg.sender] - _stake;
        if (stakes[msg.sender] == 0) removeStakeholder(msg.sender);
        _mint(msg.sender, _stake);
    }

    /**
     * @notice A method to allow a stakeholder to check his rewards.
     * @param _stakeholder The stakeholder to check rewards for.
     */
    function rewardOf(address _stakeholder) public view returns (uint256) {
        return rewards[_stakeholder];
    }

    /**
     * @notice A method to the aggregated rewards from all stakeholders.
     * @return uint256 The aggregated rewards from all stakeholders.
     */
    function totalRewards() public view returns (uint256) {
        uint256 _totalRewards = 0;
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            _totalRewards = _totalRewards += rewards[stakeholders[s]];
        }
        return _totalRewards;
    }

    /**
     * @notice A simple method that calculates the rewards for each stakeholder.
     * @param _stakeholder The stakeholder to calculate rewards for.
     */
    function calculateReward(address _stakeholder)
        public
        view
        returns (uint256)
    {
        return stakes[_stakeholder] / 100;
    }

    /**
     * @notice A method to distribute rewards to all stakeholders.
     */
    function distributeRewards() public onlyOwner {
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            address stakeholder = stakeholders[s];
            uint256 reward = calculateReward(stakeholder);
            rewards[stakeholder] = rewards[stakeholder] + reward;
        }
    }

    /**
     * @notice A method to allow a stakeholder to withdraw his rewards.
     */
    function withdrawReward() public {
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        _mint(msg.sender, reward);
    }
}
