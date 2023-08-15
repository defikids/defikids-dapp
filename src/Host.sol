// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity 0.8.15;

contract Host {
    error ParentOnly();
    error OwnerOnly();
    error MaxParentIdExceeded();
    error NotValidUserType();
    error AlreadyRegistered();
    error NotRegistered();

    mapping(address => Family) private _familyByOwner;
    mapping(address => bytes32) private _familyIdByOwner;
    mapping(address => uint24) private _userTypeByAddress;
    mapping(bytes32 => Child[]) private _childrenByFamilyId;

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
        uint24 childId;
        bool sandboxMode;
        bool isActive;
    }

    struct Family {
        bytes32 familyId;
        uint256 memberSince;
        string avatarURI;
        address payable owner;
        uint8 numOfChildren;
    }

    modifier onlyParent() {
        if (_userTypeByAddress[msg.sender] != uint24(UserType.Parent)) {
            revert ParentOnly();
        }
        _;
    }

    function registerParent(
        bytes32 _familyId,
        string memory _avatarURI
    ) public {
        Family memory family = Family({
            familyId: _familyId,
            memberSince: block.timestamp,
            avatarURI: _avatarURI,
            owner: payable(msg.sender),
            numOfChildren: 0
        });

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

    function addChild(
        bytes32 _familyId,
        string memory _username,
        string memory _avatarURI,
        address _child,
        bool _sandboxMode
    ) public onlyParent {
        uint24 currentChildCount = _familyByOwner[msg.sender].numOfChildren;

        for (uint i = 0; i < currentChildCount; i++) {
            if (_childrenByFamilyId[_familyId][i].wallet == _child) {
                revert AlreadyRegistered();
            }
        }

        Child memory child = Child({
            username: _username,
            avatarURI: _avatarURI,
            familyId: _familyId,
            memberSince: block.timestamp,
            wallet: _child,
            childId: currentChildCount++,
            sandboxMode: _sandboxMode,
            isActive: true
        });

        _childrenByFamilyId[_familyId].push(child);
        _userTypeByAddress[_child] = 2;
        _familyByOwner[msg.sender].numOfChildren++;
    }

    function updateChildAvatarURI(
        bytes32 _familyId,
        string memory _avatarURI,
        uint24 _childId
    ) public {
        uint24 userType = _userTypeByAddress[msg.sender];

        if (userType != uint24(UserType.Child)) {
            revert NotValidUserType();
        }

        _childrenByFamilyId[_familyId][_childId].avatarURI = _avatarURI;
    }

    function updateUsername(
        bytes32 _familyId,
        string memory _username,
        uint24 _childId
    ) public {
        uint24 userType = _userTypeByAddress[msg.sender];

        if (userType == uint24(UserType.Unregistered)) {
            revert NotValidUserType();
        }

        _childrenByFamilyId[_familyId][_childId].username = _username;
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
    ) public view onlyParent returns (Child memory fetchedChild) {
        uint24 currentChildCount = _familyByOwner[msg.sender].numOfChildren;

        for (uint24 i = 0; i < currentChildCount; i++) {
            if (_childrenByFamilyId[_familyId][i].wallet == _child) {
                fetchedChild = _childrenByFamilyId[_familyId][i];
            } else {
                revert NotRegistered();
            }
        }
    }

    function fetchChildren(
        bytes32 _familyId
    ) public view onlyParent returns (Child[] memory) {
        return _childrenByFamilyId[_familyId];
    }

    function toggleSandbox(
        address _child,
        bytes32 _familyId
    ) public onlyParent {
        Child memory child = fetchChild(_child, _familyId);

        child.sandboxMode = !child.sandboxMode;

        _childrenByFamilyId[_familyId][child.childId] = child;
    }
}
