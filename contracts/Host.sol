// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

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
    // mapping(address => mapping(uint256 => address)) private member_Family;
    mapping(address => mapping(uint256 => Child)) private member_Family;

    // Parent address => bool
    mapping(address => bool) private isParent;

    // Child address => bool
    mapping(address => bool) private isChild;

    struct Child {
        address _address; // the address of the child
        string username; // an identifier for the child
        bool isLocked; // account is locked
        bool isActive; // account is active
        uint256 childId; // the child's id
    }

    struct Family {
        address payable owner; // the provider of the family
        // mapping(address => Child) children; // the children of the family
        uint256 numOfChildren; // The number of children in the family
    }

    /**
     * @notice - This function is used to determine the type of user
     * 1 = parent. 2 = child. 3 = neither
     * @param _user - The address of the user.
     */
    function getUserType(address _user) external view returns (uint256) {
        if (isParent[_user]) {
            return 1;
        } else if (isChild[_user]) {
            return 2;
        } else {
            return 3;
        }
    }

    /**
     * @notice - This function is used to determine if the user is a member of a family.
     */
    function fetchChild(address _child) public view returns (Child memory) {
        require(isParent[msg.sender], "Only a parent can make this request");

        return child_AccountDetails[_child];
    }

    /**
     * @notice - This function is used to determine if the user is a member of a family.
     */
    function fetchChildren() public view returns (Child[] memory) {
        require(isParent[msg.sender], "Only a parent can make this request");

        //determine how many children the user has
        uint256 numOfChildren = parent_Family[msg.sender].numOfChildren;
        Child[] memory children = new Child[](numOfChildren);
        for (uint256 i = 0; i < numOfChildren; i++) {
            children[i] = member_Family[msg.sender][i + 1];
        }
        return children;
    }

    /**
     * @notice - This function is used to create a new family (provider).
     */
    function registerParent() public {
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
     * @param _isLocked - Determines if the child account is locked.
     */
    function addChild(
        address _child,
        string memory _username,
        bool _isLocked
    ) public {
        require(isParent[msg.sender], "Only a parent can make this request");
        require(!isChild[_child], "Child is already registered to a family");

        uint256 childId = parent_Family[msg.sender].numOfChildren + 1;

        Child memory child = Child(_child, _username, _isLocked, true, childId);

        parent_Family[msg.sender].numOfChildren = childId;

        // update mappings
        isChild[_child] = true;
        child_Parent[_child] = msg.sender;
        child_AccountDetails[_child] = child;
        member_Family[msg.sender][childId] = child;
    }

    /**
     * @notice - This function is used to change the access of a child.
     * @param _child - The address of the child.
     */
    function changeAccess(address _child, uint256 _childId) public {
        require(isParent[msg.sender], "Only a parent can make this request");
        bool accountCurrentlyLocked = child_AccountDetails[_child].isLocked;

        if (accountCurrentlyLocked == true) {
            child_AccountDetails[_child].isLocked = false;
            member_Family[msg.sender][_childId].isLocked = false;
        } else {
            child_AccountDetails[_child].isLocked = true;
            member_Family[msg.sender][_childId].isLocked = true;
        }
    }
}
