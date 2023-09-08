// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity 0.8.15;

contract Host {
    error ParentOnly();
    error OwnerOnly();
    error MaxParentIdExceeded();
    error NotValidUserType();
    error AlreadyRegistered();
    error NotRegistered();
    error NotFamilyMember();
    error FamilyIdExists();

    mapping(bytes32 => bool) private _familyIdExists;
    mapping(address => Family) private _familyByOwner;
    mapping(address => bytes32) private _familyIdByOwner;
    mapping(address => uint24) private _userTypeByAddress;
    mapping(bytes32 => mapping(address => Child)) private _childByFamilyId;

    enum UserType {
        Unregistered,
        Parent,
        Child
    }

    struct Child {
        string username;
        string avatarURI;
        bytes32 familyId;
        uint256 memberSince;
        address wallet;
        bool sandboxMode;
    }

    struct Family {
        bytes32 familyId;
        uint256 memberSince;
        string avatarURI;
        string username;
        address payable owner;
        address[] children;
    }

    modifier alreadyRegistered(bytes32 _familyId, address familyMember) {
        uint24 userType = _userTypeByAddress[familyMember];

        if (
            userType == uint24(UserType.Parent) &&
            _familyByOwner[familyMember].owner == msg.sender
        ) {
            revert AlreadyRegistered();
        }

        if (
            userType == uint24(UserType.Child) &&
            _childByFamilyId[_familyId][familyMember].wallet == familyMember
        ) {
            revert AlreadyRegistered();
        }
        _;
    }

    modifier isValidFamilyId(bytes32 _familyId) {
        if (_familyIdExists[_familyId]) {
            revert FamilyIdExists();
        }
        _;
    }

    modifier onlyParent() {
        if (_userTypeByAddress[msg.sender] != uint24(UserType.Parent)) {
            revert ParentOnly();
        }
        _;
    }

    modifier isRegistered(address familyMember) {
        if (_userTypeByAddress[familyMember] == uint24(UserType.Unregistered)) {
            revert NotRegistered();
        }
        _;
    }

    modifier isFamilyMember(bytes32 familyId) {
        address familyMember = msg.sender;

        Family memory familyDetails = _familyByOwner[familyMember];
        Child memory childDetails = _childByFamilyId[familyId][familyMember];

        if (
            familyDetails.owner != familyMember &&
            childDetails.wallet != familyMember
        ) {
            revert NotFamilyMember();
        }

        _;
    }

    function registerParent(
        bytes32 _familyId,
        string memory _avatarURI,
        string memory _username
    )
        public
        alreadyRegistered(_familyId, msg.sender)
        isValidFamilyId(_familyId)
    {
        address[] memory emptyArray;

        Family memory family = Family({
            familyId: _familyId,
            memberSince: block.timestamp,
            avatarURI: _avatarURI,
            username: _username,
            owner: payable(msg.sender),
            children: emptyArray
        });

        _familyIdExists[_familyId] = true;
        _familyByOwner[msg.sender] = family;
        _familyIdByOwner[msg.sender] = _familyId;
        _userTypeByAddress[msg.sender] = 1;
    }

    function getFamilyIdByOwner(
        address _owner
    ) public view onlyParent returns (bytes32) {
        return _familyIdByOwner[_owner];
    }

    function getFamilyByOwner(
        address _owner
    ) public view onlyParent returns (Family memory) {
        return _familyByOwner[_owner];
    }

    function updateAvatarURI(string memory _avatarURI) public onlyParent {
        _familyByOwner[msg.sender].avatarURI = _avatarURI;
    }

    function updateUsername(string memory _username) public onlyParent {
        _familyByOwner[msg.sender].username = _username;
    }

    function addChild(
        bytes32 _familyId,
        string memory _username,
        string memory _avatarURI,
        address _child,
        bool _sandboxMode
    ) public onlyParent alreadyRegistered(_familyId, _child) {
        Child memory child = Child({
            username: _username,
            avatarURI: _avatarURI,
            familyId: _familyId,
            memberSince: block.timestamp,
            wallet: _child,
            sandboxMode: _sandboxMode
        });

        _childByFamilyId[_familyId][_child] = child;
        _userTypeByAddress[_child] = 2;
        _familyByOwner[msg.sender].children.push(_child);
    }

    function updateChildAvatarURI(
        bytes32 _familyId,
        address _child,
        string memory _avatarURI
    ) public isFamilyMember(_familyId) {
        if (_userTypeByAddress[msg.sender] != uint24(UserType.Child)) {
            _childByFamilyId[_familyId][_child].avatarURI = _avatarURI;
        } else {
            _childByFamilyId[_familyId][msg.sender].avatarURI = _avatarURI;
        }
    }

    function updateChildUsername(
        bytes32 _familyId,
        address _child,
        string memory _username
    ) public isFamilyMember(_familyId) {
        if (_userTypeByAddress[msg.sender] != uint24(UserType.Child)) {
            _childByFamilyId[_familyId][_child].username = _username;
        } else {
            _childByFamilyId[_familyId][msg.sender].username = _username;
        }
    }

    function hashFamilyId(
        address _owner,
        string memory _id
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_owner, _id));
    }

    function getUserType(address _user) public view returns (uint24) {
        return _userTypeByAddress[_user];
    }

    function fetchChild(
        address _child,
        bytes32 _familyId
    ) public view isRegistered(_child) returns (Child memory fetchedChild) {
        return _childByFamilyId[_familyId][_child];
    }

    function fetchChildren(
        bytes32 _familyId
    ) public view onlyParent returns (Child[] memory) {
        address[] memory totalChildren = _familyByOwner[msg.sender].children;

        Child[] memory children = new Child[](totalChildren.length);

        if (totalChildren.length > 0) {
            for (uint256 i = 0; i < totalChildren.length; i++) {
                children[i] = _childByFamilyId[_familyId][totalChildren[i]];
            }
        }

        return children;
    }

    function toggleSandbox(
        address _child,
        bytes32 _familyId
    ) public onlyParent isRegistered(_child) {
        Child memory child = fetchChild(_child, _familyId);
        _childByFamilyId[_familyId][_child].sandboxMode = !child.sandboxMode;
    }

    function updateFamilyId(
        address _owner,
        bytes32 _familyId,
        bytes32 _updatedFamilyId
    ) public onlyParent isValidFamilyId(_updatedFamilyId) {
        Family storage updatedFamily = _familyByOwner[_owner];

        // Update the family ID for the owner
        _familyIdByOwner[_owner] = _updatedFamilyId;

        // Update the family ID in the family struct
        updatedFamily.familyId = _updatedFamilyId;

        // Get the children associated with the old family ID
        address[] memory children = updatedFamily.children;

        // Update the _childByFamilyId mapping with the updated familyId
        for (uint256 i = 0; i < children.length; i++) {
            address child = children[i];
            Child storage childData = _childByFamilyId[_familyId][child];

            childData.familyId = _updatedFamilyId;

            _childByFamilyId[_updatedFamilyId][child] = childData;

            delete _childByFamilyId[_familyId][child];
            _familyIdExists[_familyId] = false;
        }
    }
}
