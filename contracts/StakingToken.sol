// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

interface ISuperfluidToken {
    function transferFrom(
        address holder,
        address recipient,
        uint256 amount
    ) external;
}

/**
 * @notice Implements a basic ERC20 staking token with incentive distribution.
 */
contract StakingToken is ERC20Upgradeable {
    address[] internal stakeholders;
    address private owner;
    address constant DK_USDCX = 0x9D324D73a6d43A6c66e080E65bF705F4e078495E;
    address constant USDCX_MUMBAI = 0x42bb40bF79730451B11f6De1CbA222F17b87Afd7;
    uint256 private REWARD_RATE;
    mapping(address => Child) private address_child;
    mapping(address => mapping(uint256 => Stake)) child_stake;

    struct Child {
        uint256 totalInvested;
        uint256 totalRewards;
        uint256 totalCreatedStakes;
    }
    struct Stake {
        uint256 stakeId;
        uint256 stakeStartTime;
        uint256 stakeEndTime;
        uint256 amount;
        uint256 duration;
        string itemName;
    }

    function initialize(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) external initializer {
        __ERC20_init(_name, _symbol);
        owner = _msgSender();
        REWARD_RATE = 500;
        _mint(_msgSender(), _totalSupply);
    }

    modifier onlyOwner() {
        require(owner == _msgSender(), "caller is not the owner");
        _;
    }

    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        REWARD_RATE = _rewardRate;
    }

    function checkDuration(uint256 _stakeId) external view returns (uint256) {
        uint256 _stakeEndTime = child_stake[_msgSender()][_stakeId]
            .stakeEndTime;
        uint256 timeRemaining = _stakeEndTime - block.timestamp;
        if (timeRemaining < 0) {
            return 0;
        } else {
            return timeRemaining;
        }
    }

    /**
     * @notice A method for a stakeholder to create a stake.
     * @param _stake The size of the stake to be created.
     * @param _duration (enum value 0 = 1, 1 = 7, 2 = 14 days)
     * @param _itemName The name of the item that the child is staking/saving for.
     */
    function createStake(
        uint256 _stake,
        uint256 _duration,
        string memory _itemName
    ) public {
        // transfer funds to the USDCx contract
        ISuperfluidToken(USDCX_MUMBAI).transferFrom(
            _msgSender(),
            DK_USDCX,
            _stake
        );
        uint256 endTime;
        uint256 requestedDuration;
        if (_duration == 0) {
            endTime = block.timestamp + 1 days;
            requestedDuration = 1;
        } else if (_duration == 1) {
            endTime = block.timestamp + 7 days;
            requestedDuration = 7;
        } else {
            endTime = block.timestamp + 14 days;
            requestedDuration = 14;
        }
        uint256 reward = calculateReward(_stake, requestedDuration);
        _mint(_msgSender(), reward); // transferring Allocate tokens
        // Update total rewards for the user
        address_child[_msgSender()].totalRewards += reward;

        uint256 newStakeId = address_child[_msgSender()]
            .totalCreatedStakes += 1;
        // Update total stakes created by the child
        address_child[_msgSender()].totalCreatedStakes = newStakeId;
        Stake memory _newStake = Stake({
            stakeId: newStakeId,
            stakeStartTime: block.timestamp,
            stakeEndTime: endTime,
            amount: _stake,
            duration: requestedDuration,
            itemName: _itemName
        });

        // Add the stake to the childs account
        child_stake[_msgSender()][newStakeId] = _newStake;
        // Update total invested by user
        address_child[_msgSender()].totalInvested += _stake;
    }

    /**
     * @notice - This function is used to determine if the user is a member of a family.
     */
    function fetchStakes(address _staker)
        external
        view
        returns (Stake[] memory)
    {
        //determine how many stakes the user has
        uint256 numOfStakes = address_child[_staker].totalCreatedStakes;
        Stake[] memory stakes = new Stake[](numOfStakes);
        for (uint256 i = 0; i < numOfStakes; i++) {
            stakes[i] = child_stake[_staker][i + 1];
        }
        return stakes;
    }

    function fetchStakerDetails(address _staker)
        external
        view
        returns (Child memory)
    {
        return address_child[_staker];
    }

    function calculateReward(uint256 _stake, uint256 requestedDuration)
        private
        view
        returns (uint256)
    {
        return (_stake * REWARD_RATE * requestedDuration) / 1e4;
    }
}
