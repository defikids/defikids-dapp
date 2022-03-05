// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @notice Implements a basic ERC20 staking token with incentive distribution.
 */
contract AllocateStakingToken is ERC20, Ownable {
    address[] internal stakeholders;
    address constant ALLOCATE_USDCX = 0x9D324D73a6d43A6c66e080E65bF705F4e078495E; //Our wallet address.
    uint256 private REWARD_RATE = 0.05 ether;
    // mapping(address => uint256) internal stakes; // The stakes for each stakeholder.
    mapping(address => Child) private address_child;
    mapping(address => mapping(uint256 => Stake)) child_stake;
   
    struct Child{
        uint256 totalInvested;
        uint256 totalRewards;
        uint256 totalCreatedStakes;
    }
    struct Stake{
        uint256 stakeId;
        uint256 stakeStartTime; 
        uint256 stakeEndTime; 
        uint256 amount;
        uint256 duration;
    }
   
    constructor(string memory _name, string memory _symbol, uint256 initialSupply) ERC20(_name, _symbol) {
        _mint(msg.sender, initialSupply);
    }
   function checkDuration(uint256 _stakeId) public view  returns(uint256){
         uint256 _stakeEndTime = child_stake[msg.sender][_stakeId].stakeEndTime;
         uint256 timeRemaining = _stakeEndTime - block.timestamp;
         if(timeRemaining < 0){
             return 0;
         }else{
             return timeRemaining;
         }
   }
  
    /**
     * @notice A method for a stakeholder to create a stake.
     * @param _stake The size of the stake to be created.
     * @param _duration (enum value 0 = 1, 1 = 7, 2 = 14 days)
     */
    function createStake(uint256 _stake, uint256 _duration) public {
        // transfer funds to the USDCx contract
        IERC20(0x42bb40bF79730451B11f6De1CbA222F17b87Afd7).transferFrom(address(this),ALLOCATE_USDCX, _stake);
            uint256 endTime;
            uint256 requestedDuration;
            if(_duration == 0){
                endTime = 864000 + block.timestamp;
                requestedDuration = 1;
            }else if( _duration == 1){
                endTime = 604800 + block.timestamp;
                requestedDuration = 7;
            }else{
                endTime = 12096000 + block.timestamp;
                requestedDuration = 14;
            }
             uint256 reward = calculateReward(_stake,requestedDuration);
            ERC20.transferFrom(address(this),msg.sender, reward); // transferring Allocate tokens
            // Update total rewards for the user
            address_child[msg.sender].totalRewards += reward;
            
            uint256 newStakeId = address_child[msg.sender].totalCreatedStakes +=1;
            // Update total stakes created by the child
            address_child[msg.sender].totalCreatedStakes = newStakeId;
             Stake memory _newStake = Stake({
                stakeId:newStakeId,
                stakeStartTime:block.timestamp,
                stakeEndTime:endTime,
                amount:_stake,
                duration: requestedDuration
             });
             
             // Add the stake to the childs account
             child_stake[msg.sender][newStakeId] = _newStake;
             // Update total invested by user
             address_child[msg.sender].totalInvested += _stake;
    }
      /**
     * @notice - This function is used to determine if the user is a member of a family.
     */
    function fetchStakes(address _staker) external view returns (Stake[] memory) {
        //determine how many stakes the user has
        uint256 numOfStakes = address_child[_staker].totalCreatedStakes;
        Stake[] memory stakes = new Stake[](numOfStakes);
        for (uint256 i = 0; i < numOfStakes; i++) {
            stakes[i] = child_stake[_staker][i + 1];
        }
        return stakes;
    }
    function fetchStakerDetails(address _staker) external view returns(Child memory){
            return address_child[_staker];
    }
    function calculateReward(uint256 _stake, uint256 requestedDuration) private view returns(uint256) {
            uint256 rate = _stake * REWARD_RATE;
            uint256 reward = rate * requestedDuration;
            return reward;
    }
}
