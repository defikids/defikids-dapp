/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { StakingToken } from "./StakingToken";

export class StakingTokenFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<StakingToken> {
    return super.deploy(overrides || {}) as Promise<StakingToken>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): StakingToken {
    return super.attach(address) as StakingToken;
  }
  connect(signer: Signer): StakingTokenFactory {
    return super.connect(signer) as StakingTokenFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): StakingToken {
    return new Contract(address, _abi, signerOrProvider) as StakingToken;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_totalSupply",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rewardRate",
        type: "uint256",
      },
    ],
    name: "setRewardRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_stakeId",
        type: "uint256",
      },
    ],
    name: "checkDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_stake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_itemName",
        type: "string",
      },
    ],
    name: "createStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_staker",
        type: "address",
      },
    ],
    name: "fetchStakes",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "stakeId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakeStartTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakeEndTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "itemName",
            type: "string",
          },
        ],
        internalType: "struct StakingToken.Stake[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_staker",
        type: "address",
      },
    ],
    name: "fetchStakerDetails",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "totalInvested",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalRewards",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalCreatedStakes",
            type: "uint256",
          },
        ],
        internalType: "struct StakingToken.Child",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506129bd806100206000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c806359185b07116100a2578063a457c2d711610071578063a457c2d7146102e0578063a9059cbb14610310578063b119490e14610340578063dd62ed3e1461035c578063e14525741461038c5761010b565b806359185b071461025a57806370a082311461027657806395d89b41146102a65780639e447fc6146102c45761010b565b806323b872dd116100de57806323b872dd146101ac578063313ce567146101dc57806339509351146101fa57806340bad2ee1461022a5761010b565b806306fdde0314610110578063095ea7b31461012e57806318160ddd1461015e578063205a09031461017c575b600080fd5b6101186103bc565b6040516101259190612434565b60405180910390f35b61014860048036038101906101439190611c8b565b61044e565b6040516101559190612419565b60405180910390f35b61016661046c565b60405161017391906125b1565b60405180910390f35b61019660048036038101906101919190611bd7565b610476565b6040516101a39190612596565b60405180910390f35b6101c660048036038101906101c19190611c3c565b6104ed565b6040516101d39190612419565b60405180910390f35b6101e46105ee565b6040516101f191906125cc565b60405180910390f35b610214600480360381019061020f9190611c8b565b6105f7565b6040516102219190612419565b60405180910390f35b610244600480360381019061023f9190611d6f565b6106a3565b60405161025191906125b1565b60405180910390f35b610274600480360381019061026f9190611d98565b610732565b005b610290600480360381019061028b9190611bd7565b610ac9565b60405161029d91906125b1565b60405180910390f35b6102ae610b12565b6040516102bb9190612434565b60405180910390f35b6102de60048036038101906102d99190611d6f565b610ba4565b005b6102fa60048036038101906102f59190611c8b565b610c45565b6040516103079190612419565b60405180910390f35b61032a60048036038101906103259190611c8b565b610d39565b6040516103379190612419565b60405180910390f35b61035a60048036038101906103559190611cf0565b610d57565b005b61037660048036038101906103719190611c00565b610ea4565b60405161038391906125b1565b60405180910390f35b6103a660048036038101906103a19190611bd7565b610f2b565b6040516103b391906123f7565b60405180910390f35b6060603680546103cb90612829565b80601f01602080910402602001604051908101604052809291908181526020018280546103f790612829565b80156104445780601f1061041957610100808354040283529160200191610444565b820191906000526020600020905b81548152906001019060200180831161042757829003601f168201915b5050505050905090565b600061046261045b61118a565b8484611192565b6001905092915050565b6000603554905090565b61047e611a36565b606860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180606001604052908160008201548152602001600182015481526020016002820154815250509050919050565b60006104fa84848461135d565b6000603460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600061054561118a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050828110156105c5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105bc906124d6565b60405180910390fd5b6105e2856105d161118a565b85846105dd919061275e565b611192565b60019150509392505050565b60006012905090565b600061069961060461118a565b84846034600061061261118a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461069491906126ae565b611192565b6001905092915050565b600080606960006106b261118a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084815260200190815260200160002060020154905060004282610711919061275e565b905060008110156107275760009250505061072d565b80925050505b919050565b7342bb40bf79730451b11f6de1cba222f17b87afd773ffffffffffffffffffffffffffffffffffffffff166323b872dd61076a61118a565b739d324d73a6d43a6c66e080e65bf705f4e078495e866040518463ffffffff1660e01b815260040161079e939291906123c0565b602060405180830381600087803b1580156107b857600080fd5b505af11580156107cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107f09190611cc7565b5060008060008414156108175742620d2f0061080c91906126ae565b915060019050610851565b600184141561083a574262093a8061082f91906126ae565b915060079050610850565b4262b8920061084991906126ae565b9150600e90505b5b600061085d86836115df565b90506108713061086b61118a565b836104ed565b50806068600061087f61118a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160008282546108cb91906126ae565b9250508190555060006001606860006108e261118a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600201600082825461092e91906126ae565b9250508190559050806068600061094361118a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206002018190555060006040518060c0016040528083815260200142815260200186815260200189815260200185815260200187815250905080606960006109c261118a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000848152602001908152602001600020600082015181600001556020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005019080519060200190610a5b929190611a57565b509050508760686000610a6c61118a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000016000828254610ab891906126ae565b925050819055505050505050505050565b6000603360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b606060378054610b2190612829565b80601f0160208091040260200160405190810160405280929190818152602001828054610b4d90612829565b8015610b9a5780601f10610b6f57610100808354040283529160200191610b9a565b820191906000526020600020905b815481529060010190602001808311610b7d57829003601f168201915b5050505050905090565b610bac61118a565b73ffffffffffffffffffffffffffffffffffffffff16606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610c3b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c32906124f6565b60405180910390fd5b8060678190555050565b60008060346000610c5461118a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082811015610d11576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d0890612556565b60405180910390fd5b610d2e610d1c61118a565b858584610d29919061275e565b611192565b600191505092915050565b6000610d4d610d4661118a565b848461135d565b6001905092915050565b600060019054906101000a900460ff1680610d7d575060008054906101000a900460ff16155b610dbc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610db3906124b6565b60405180910390fd5b60008060019054906101000a900460ff161590508015610e0c576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610e16848461160d565b610e1e61118a565b606660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555066b1a2bc2ec50000606781905550610e7d610e7761118a565b836116fa565b8015610e9e5760008060016101000a81548160ff0219169083151502179055505b50505050565b6000603460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60606000606860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020154905060008167ffffffffffffffff811115610fb6577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051908082528060200260200182016040528015610fef57816020015b610fdc611add565b815260200190600190039081610fd45790505b50905060005b8281101561117f57606960008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600060018361104b91906126ae565b81526020019081526020016000206040518060c001604052908160008201548152602001600182015481526020016002820154815260200160038201548152602001600482015481526020016005820180546110a690612829565b80601f01602080910402602001604051908101604052809291908181526020018280546110d290612829565b801561111f5780601f106110f45761010080835404028352916020019161111f565b820191906000526020600020905b81548152906001019060200180831161110257829003601f168201915b505050505081525050828281518110611161577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001018190525080806111779061285b565b915050610ff5565b508092505050919050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611202576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111f990612536565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611272576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161126990612476565b60405180910390fd5b80603460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258360405161135091906125b1565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156113cd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113c490612516565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561143d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161143490612456565b60405180910390fd5b61144883838361184f565b6000603360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050818110156114cf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114c690612496565b60405180910390fd5b81816114db919061275e565b603360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081603360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461156d91906126ae565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516115d191906125b1565b60405180910390a350505050565b600080606754846115f09190612704565b9050600083826116009190612704565b9050809250505092915050565b600060019054906101000a900460ff1680611633575060008054906101000a900460ff16155b611672576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611669906124b6565b60405180910390fd5b60008060019054906101000a900460ff1615905080156116c2576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6116ca611854565b6116d4838361192d565b80156116f55760008060016101000a81548160ff0219169083151502179055505b505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561176a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161176190612576565b60405180910390fd5b6117766000838361184f565b806035600082825461178891906126ae565b9250508190555080603360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546117de91906126ae565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161184391906125b1565b60405180910390a35050565b505050565b600060019054906101000a900460ff168061187a575060008054906101000a900460ff16155b6118b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016118b0906124b6565b60405180910390fd5b60008060019054906101000a900460ff161590508015611909576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b801561192a5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680611953575060008054906101000a900460ff16155b611992576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611989906124b6565b60405180910390fd5b60008060019054906101000a900460ff1615905080156119e2576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b82603690805190602001906119f8929190611a57565b508160379080519060200190611a0f929190611a57565b508015611a315760008060016101000a81548160ff0219169083151502179055505b505050565b60405180606001604052806000815260200160008152602001600081525090565b828054611a6390612829565b90600052602060002090601f016020900481019282611a855760008555611acc565b82601f10611a9e57805160ff1916838001178555611acc565b82800160010185558215611acc579182015b82811115611acb578251825591602001919060010190611ab0565b5b509050611ad99190611b13565b5090565b6040518060c001604052806000815260200160008152602001600081526020016000815260200160008152602001606081525090565b5b80821115611b2c576000816000905550600101611b14565b5090565b6000611b43611b3e84612618565b6125e7565b905082815260208101848484011115611b5b57600080fd5b611b668482856127e7565b509392505050565b600081359050611b7d81612942565b92915050565b600081519050611b9281612959565b92915050565b600082601f830112611ba957600080fd5b8135611bb9848260208601611b30565b91505092915050565b600081359050611bd181612970565b92915050565b600060208284031215611be957600080fd5b6000611bf784828501611b6e565b91505092915050565b60008060408385031215611c1357600080fd5b6000611c2185828601611b6e565b9250506020611c3285828601611b6e565b9150509250929050565b600080600060608486031215611c5157600080fd5b6000611c5f86828701611b6e565b9350506020611c7086828701611b6e565b9250506040611c8186828701611bc2565b9150509250925092565b60008060408385031215611c9e57600080fd5b6000611cac85828601611b6e565b9250506020611cbd85828601611bc2565b9150509250929050565b600060208284031215611cd957600080fd5b6000611ce784828501611b83565b91505092915050565b600080600060608486031215611d0557600080fd5b600084013567ffffffffffffffff811115611d1f57600080fd5b611d2b86828701611b98565b935050602084013567ffffffffffffffff811115611d4857600080fd5b611d5486828701611b98565b9250506040611d6586828701611bc2565b9150509250925092565b600060208284031215611d8157600080fd5b6000611d8f84828501611bc2565b91505092915050565b600080600060608486031215611dad57600080fd5b6000611dbb86828701611bc2565b9350506020611dcc86828701611bc2565b925050604084013567ffffffffffffffff811115611de957600080fd5b611df586828701611b98565b9150509250925092565b6000611e0b838361230a565b905092915050565b611e1c81612792565b82525050565b6000611e2d82612658565b611e37818561267b565b935083602082028501611e4985612648565b8060005b85811015611e855784840389528151611e668582611dff565b9450611e718361266e565b925060208a01995050600181019050611e4d565b50829750879550505050505092915050565b611ea0816127a4565b82525050565b6000611eb182612663565b611ebb818561268c565b9350611ecb8185602086016127f6565b611ed481612931565b840191505092915050565b6000611eea82612663565b611ef4818561269d565b9350611f048185602086016127f6565b611f0d81612931565b840191505092915050565b6000611f2560238361269d565b91507f45524332303a207472616e7366657220746f20746865207a65726f206164647260008301527f65737300000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000611f8b60228361269d565b91507f45524332303a20617070726f766520746f20746865207a65726f20616464726560008301527f73730000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000611ff160268361269d565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206260008301527f616c616e636500000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000612057602e8361269d565b91507f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008301527f647920696e697469616c697a65640000000000000000000000000000000000006020830152604082019050919050565b60006120bd60288361269d565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206160008301527f6c6c6f77616e63650000000000000000000000000000000000000000000000006020830152604082019050919050565b600061212360178361269d565b91507f63616c6c6572206973206e6f7420746865206f776e65720000000000000000006000830152602082019050919050565b600061216360258361269d565b91507f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008301527f64726573730000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006121c960248361269d565b91507f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008301527f72657373000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b600061222f60258361269d565b91507f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008301527f207a65726f0000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000612295601f8361269d565b91507f45524332303a206d696e7420746f20746865207a65726f2061646472657373006000830152602082019050919050565b6060820160008201516122de6000850182612393565b5060208201516122f16020850182612393565b5060408201516123046040850182612393565b50505050565b600060c0830160008301516123226000860182612393565b5060208301516123356020860182612393565b5060408301516123486040860182612393565b50606083015161235b6060860182612393565b50608083015161236e6080860182612393565b5060a083015184820360a08601526123868282611ea6565b9150508091505092915050565b61239c816127d0565b82525050565b6123ab816127d0565b82525050565b6123ba816127da565b82525050565b60006060820190506123d56000830186611e13565b6123e26020830185611e13565b6123ef60408301846123a2565b949350505050565b600060208201905081810360008301526124118184611e22565b905092915050565b600060208201905061242e6000830184611e97565b92915050565b6000602082019050818103600083015261244e8184611edf565b905092915050565b6000602082019050818103600083015261246f81611f18565b9050919050565b6000602082019050818103600083015261248f81611f7e565b9050919050565b600060208201905081810360008301526124af81611fe4565b9050919050565b600060208201905081810360008301526124cf8161204a565b9050919050565b600060208201905081810360008301526124ef816120b0565b9050919050565b6000602082019050818103600083015261250f81612116565b9050919050565b6000602082019050818103600083015261252f81612156565b9050919050565b6000602082019050818103600083015261254f816121bc565b9050919050565b6000602082019050818103600083015261256f81612222565b9050919050565b6000602082019050818103600083015261258f81612288565b9050919050565b60006060820190506125ab60008301846122c8565b92915050565b60006020820190506125c660008301846123a2565b92915050565b60006020820190506125e160008301846123b1565b92915050565b6000604051905081810181811067ffffffffffffffff8211171561260e5761260d612902565b5b8060405250919050565b600067ffffffffffffffff82111561263357612632612902565b5b601f19601f8301169050602081019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b60006126b9826127d0565b91506126c4836127d0565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156126f9576126f86128a4565b5b828201905092915050565b600061270f826127d0565b915061271a836127d0565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615612753576127526128a4565b5b828202905092915050565b6000612769826127d0565b9150612774836127d0565b925082821015612787576127866128a4565b5b828203905092915050565b600061279d826127b0565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b82818337600083830152505050565b60005b838110156128145780820151818401526020810190506127f9565b83811115612823576000848401525b50505050565b6000600282049050600182168061284157607f821691505b60208210811415612855576128546128d3565b5b50919050565b6000612866826127d0565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612899576128986128a4565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b61294b81612792565b811461295657600080fd5b50565b612962816127a4565b811461296d57600080fd5b50565b612979816127d0565b811461298457600080fd5b5056fea2646970667358221220230aa7def48b8e671ecff44b525d9cf1dbc3abb3aaf46419b9b160abe6ba598564736f6c63430008000033";