// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
}

contract Host {
    // Child address => parentAddress
    // Used when creating a new child
    mapping(address => address) private child_Parent;

    // Child address => Child Struct
    // Used when creating a new child
    mapping(address => Child) private child_AccountDetails;

    // Family parentAddress => Family
    // Used when creating a family
    mapping(address => Family) private parent_Family;

    // Parent address => childId => childAddress
    // Used when creating a new child
    // mapping(address => mapping(uint8 => address)) private member_Family;
    mapping(address => mapping(uint8 => Child)) private member_Family;

    // Parent address => bool
    mapping(address => bool) private isParent;

    // Child address => bool
    mapping(address => bool) private isChild;

    enum Access {
        Locked, // Locked by parent. Can't be unlocked by child. No access to the crypto markets.
        Unlocked // Unlocked by parent. Can't be unlocked by child. Can access the crypto markets.
    }

    struct Child {
        address _address; // the address of the child
        string username; // an identifier for the child
        Access access; // locked(0) or unlocked(1)
    }

    struct Family {
        address payable owner; // the provider of the family
        // mapping(address => Child) children; // the children of the family
        uint8 numOfChildren; // The number of children in the family
    }

    struct TimeLock {
        uint256 id; // unique id of the timelock
        address owner; // owner of the timelock
        uint256 start; // start time of the timelock
        uint256 end; // end time of the timelock
        uint256 startingBlock; // block when the timelock was created
        string item; // item that the user is saving for
        string description; // description of the item
        uint256 amount; // amount that the user is locking up.
        bool isActive; // shows the state of the current timelock.
    }


    /** 
     * @notice - This function is used to determine the type of user
     * 1 = parent. 2 = child. 3 = neither
     * @param _user - The address of the user.
     */
    function getUserType(address _user) external view returns(uint256){
        if(isParent[_user]){
            return 1;
        }else if (isChild[_user]){
            return 2;
        }else{
            return 3;
        }
    }

    /**
     * @notice - This function is used to determine if the user is a member of a family.
     */
    function fetchChildren() public view returns (Child[] memory) {
        require(isParent[msg.sender], "Only a parent can make this request");

        //determine how many children the user has
        uint8 numOfChildren = parent_Family[msg.sender].numOfChildren;
        Child[] memory children = new Child[](numOfChildren);
        for (uint8 i = 0; i < numOfChildren; i++) {
            children[i] = member_Family[msg.sender][i + 1];
        }
        return children;
    }

    /**
     * @notice - This function is used to create a new family (provider).
     */
    function createParent() public {
        require(
            !isParent[msg.sender],
            "You are already registered as a parent"
        );

        // create a new family
        Family memory family = Family({
            owner: payable(msg.sender),
            numOfChildren: 0
        });
        parent_Family[msg.sender] = family;
        isParent[msg.sender] = true;
    }

    /**
     * @notice - This function is used to add a child to the family.
     * @param _child - The address of the child.
     * @param _username - The username of the child.
     */
    function addMember(address _child, string memory _username) public {
        require(isParent[msg.sender], "Only a parent can make this request");
        require(!isChild[_child], "Child is already registered to a family");
        // get the family
        // Family storage family = locateFamily(msg.sender);

        // get the child
        Child memory child = Child({
            _address: _child,
            username: _username,
            access: Access.Locked
        });

        // get next id number for the child
        uint8 childId = parent_Family[msg.sender].numOfChildren + 1;

        // update child count
        parent_Family[msg.sender].numOfChildren = childId;

        // update mappings
        isChild[_child] = true;
        child_Parent[_child] = msg.sender;
        child_AccountDetails[_child] = child;
        // member_Family[msg.sender][childId] = _child;
        member_Family[msg.sender][childId] = child;
    }

    /**
     * @notice - This function is used to change the access of a child.
     * @param _child - The address of the child.
     */
    function changeAccess(address _child) public {
        require(isParent[msg.sender], "Only a parent can make this request");

        // current status
        Access currentAccess = child_AccountDetails[_child].access;

        // change the access of the child
        if (currentAccess == Access.Locked) {
            child_AccountDetails[_child].access = Access.Unlocked;
        } else {
            child_AccountDetails[_child].access = Access.Locked;
        }
    }
}
