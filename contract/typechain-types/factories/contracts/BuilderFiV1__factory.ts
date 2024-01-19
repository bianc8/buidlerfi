/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  BuilderFiV1,
  BuilderFiV1Interface,
} from "../../contracts/BuilderFiV1";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CannotSellLastShare",
    type: "error",
  },
  {
    inputs: [],
    name: "FundsTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientPayment",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientShares",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlySharesSubjectCanBuyFirstShare",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "subject",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isBuy",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shareAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "protocolEthAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "subjectEthAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "hodlerEthAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "supply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nextPrice",
        type: "uint256",
      },
    ],
    name: "Trade",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newAdmin",
        type: "address",
      },
    ],
    name: "addAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "builder",
        type: "address",
      },
      {
        internalType: "address",
        name: "holder",
        type: "address",
      },
    ],
    name: "builderCardsBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
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
        name: "builder",
        type: "address",
      },
    ],
    name: "builderCardsSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "supply",
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
        name: "sharesSubject",
        type: "address",
      },
    ],
    name: "buyShares",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "disableTrading",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "enableTrading",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sharesSubject",
        type: "address",
      },
    ],
    name: "getBuyPrice",
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
        name: "sharesSubject",
        type: "address",
      },
    ],
    name: "getBuyPriceAfterFee",
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
        name: "supply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sharesSubject",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "getSellPrice",
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
        name: "sharesSubject",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "getSellPriceAfterFee",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hodlerFeePercent",
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
    name: "protocolFeeDestination",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFeePercent",
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
        name: "_newAdmin",
        type: "address",
      },
    ],
    name: "removeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sharesSubject",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "sellShares",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeDestination",
        type: "address",
      },
    ],
    name: "setFeeDestination",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feePercent",
        type: "uint256",
      },
    ],
    name: "setHodlerFeePercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feePercent",
        type: "uint256",
      },
    ],
    name: "setProtocolFeePercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feePercent",
        type: "uint256",
      },
    ],
    name: "setSubjectFeePercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "subjectFeePercent",
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
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tradingEnabled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620019f8380380620019f88339810160408190526200003491620000e9565b6200004160008262000048565b506200011b565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620000e5576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620000a43390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b600060208284031215620000fc57600080fd5b81516001600160a01b03811681146200011457600080fd5b9392505050565b6118cd806200012b6000396000f3fe6080604052600436106101c25760003560e01c806370480275116100f7578063a22a5e6611610095578063d547741f11610064578063d547741f14610528578063d6e6eb9f14610548578063e5aef9f81461055e578063fbe532341461057e57600080fd5b8063a22a5e66146104a8578063a4983421146104d5578063b51d0534146104f5578063cedc72771461050857600080fd5b80638e8da06f116100d15780638e8da06f146103f757806391d148541461042f5780639ae7178114610473578063a217fddf1461049357600080fd5b806370480275146103ac5780638546e75f146103cc5780638a8c523c146103e257600080fd5b80633365dd94116101645780634c85b4251161013e5780634c85b425146103215780634ce7957c146103345780635a8a764e1461036c5780635cf4ee911461038c57600080fd5b80633365dd94146102c757806336568abe146102e75780634ada218b1461030757600080fd5b80632267a89c116101a05780632267a89c14610233578063248a9ca31461026157806324dc441d146102915780632f2ff15d146102a757600080fd5b806301ffc9a7146101c757806317700f01146101fc5780631785f53c14610213575b600080fd5b3480156101d357600080fd5b506101e76101e23660046115ba565b61059e565b60405190151581526020015b60405180910390f35b34801561020857600080fd5b50610211610637565b005b34801561021f57600080fd5b5061021161022e366004611618565b61064f565b34801561023f57600080fd5b5061025361024e366004611633565b610669565b6040519081526020016101f3565b34801561026d57600080fd5b5061025361027c36600461165d565b60009081526020819052604090206001015490565b34801561029d57600080fd5b5061025360035481565b3480156102b357600080fd5b506102116102c2366004611676565b610712565b3480156102d357600080fd5b506102116102e236600461165d565b61073c565b3480156102f357600080fd5b50610211610302366004611676565b61074d565b34801561031357600080fd5b506005546101e79060ff1681565b61021161032f366004611618565b6107da565b34801561034057600080fd5b50600154610354906001600160a01b031681565b6040516001600160a01b0390911681526020016101f3565b34801561037857600080fd5b5061021161038736600461165d565b610b52565b34801561039857600080fd5b506102536103a73660046116a2565b610b63565b3480156103b857600080fd5b506102116103c7366004611618565b610c84565b3480156103d857600080fd5b5061025360045481565b3480156103ee57600080fd5b50610211610c9a565b34801561040357600080fd5b506102536104123660046116c4565b600660209081526000928352604080842090915290825290205481565b34801561043b57600080fd5b506101e761044a366004611676565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b34801561047f57600080fd5b5061025361048e366004611633565b610cb5565b34801561049f57600080fd5b50610253600081565b3480156104b457600080fd5b506102536104c3366004611618565b60076020526000908152604090205481565b3480156104e157600080fd5b506102116104f036600461165d565b610cea565b610211610503366004611633565b610cfb565b34801561051457600080fd5b50610253610523366004611618565b6110fe565b34801561053457600080fd5b50610211610543366004611676565b611122565b34801561055457600080fd5b5061025360025481565b34801561056a57600080fd5b50610253610579366004611618565b611147565b34801561058a57600080fd5b50610211610599366004611618565b6111e4565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f7965db0b00000000000000000000000000000000000000000000000000000000148061063157507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b60006106428161122a565b506005805460ff19169055565b600061065a8161122a565b610665600083611237565b5050565b6000806106768484610cb5565b90506000670de0b6b3a7640000600254836106919190611704565b61069b919061171b565b90506000670de0b6b3a7640000600354846106b69190611704565b6106c0919061171b565b90506000670de0b6b3a7640000600454856106db9190611704565b6106e5919061171b565b905080826106f3858761173d565b6106fd919061173d565b610707919061173d565b979650505050505050565b60008281526020819052604090206001015461072d8161122a565b61073783836112b6565b505050565b60006107478161122a565b50600455565b6001600160a01b03811633146107d05760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c66000000000000000000000000000000000060648201526084015b60405180910390fd5b6106658282611237565b60055460ff1615156001146108315760405162461bcd60e51b815260206004820152601660248201527f54726164696e67206973206e6f7420656e61626c65640000000000000000000060448201526064016107c7565b6001600160a01b0381166000908152600760205260409020548015801561086157506001600160a01b0382163314155b15610898576040517f80843b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006108a5826001610b63565b905060006108be6108b7846001611750565b6001610b63565b90506000670de0b6b3a7640000600254846108d99190611704565b6108e3919061171b565b90506000670de0b6b3a7640000600354856108fe9190611704565b610908919061171b565b90506000670de0b6b3a7640000600454866109239190611704565b61092d919061171b565b9050808261093b8588611750565b6109459190611750565b61094f9190611750565b341015610988576040517fcd1c886700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600160a01b038716600090815260066020908152604080832033845290915281208054916109b783611763565b90915550506001600160a01b03871660009081526007602052604081208054916109e083611763565b909155507fd5bfddbe72aa2c9b73b3fe3ad6d90e4dc2bb1b80d51272e831927c33f587a4419050338860018089888888610a1a8f86611750565b604080516001600160a01b039a8b168152989099166020890152951515878901526060870194909452608086019290925260a085015260c084015260e083015261010082015261012081018790529051908190036101400190a16001546040516000916001600160a01b03169085908381818185875af1925050503d8060008114610ac1576040519150601f19603f3d011682016040523d82523d6000602084013e610ac6565b606091505b505090506000886001600160a01b03168460405160006040518083038185875af1925050503d8060008114610b17576040519150601f19603f3d011682016040523d82523d6000602084013e610b1c565b606091505b50509050818015610b2a5750805b610b4757604051634a66f90360e01b815260040160405180910390fd5b505050505050505050565b6000610b5d8161122a565b50600355565b6000808315610bbe576006610b7960018661173d565b610b84906002611704565b610b8f906001611750565b85610b9b60018261173d565b610ba59190611704565b610baf9190611704565b610bb9919061171b565b610bc1565b60005b9050600084158015610bd35750836001145b610c485760066001610be58688611750565b610bef919061173d565b610bfa906002611704565b610c05906001611750565b610c0f8688611750565b6001610c1b888a611750565b610c25919061173d565b610c2f9190611704565b610c399190611704565b610c43919061171b565b610c4b565b60005b90506000610c59838361173d565b9050613e80610c7082670de0b6b3a7640000611704565b610c7a919061171b565b9695505050505050565b6000610c8f8161122a565b6106656000836112b6565b6000610ca58161122a565b506005805460ff19166001179055565b6001600160a01b038216600090815260076020526040812054610ce390610cdd90849061173d565b83610b63565b9392505050565b6000610cf58161122a565b50600255565b60055460ff161515600114610d525760405162461bcd60e51b815260206004820152601660248201527f54726164696e67206973206e6f7420656e61626c65640000000000000000000060448201526064016107c7565b6001600160a01b038216600090815260076020526040902054818111610da4576040517fb4abda3900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600160a01b0383166000908152600660209081526040808320338452909152902054821115610e01576040517f3999656700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000610e16610e10848461173d565b84610b63565b905060008115610e3c57610e396001610e2f868661173d565b6108b7919061173d565b90505b6000670de0b6b3a764000060025484610e559190611704565b610e5f919061171b565b90506000670de0b6b3a764000060035485610e7a9190611704565b610e84919061171b565b90506000670de0b6b3a764000060045486610e9f9190611704565b610ea9919061171b565b6001600160a01b0389166000908152600660209081526040808320338452909152812080549293508992909190610ee190849061173d565b90915550610ef19050878761173d565b600760008a6001600160a01b03166001600160a01b03168152602001908152602001600020819055507fd5bfddbe72aa2c9b73b3fe3ad6d90e4dc2bb1b80d51272e831927c33f587a441338960008a898888888f8f610f50919061173d565b604080516001600160a01b039a8b168152989099166020890152951515878901526060870194909452608086019290925260a085015260c084015260e083015261010082015261012081018790529051908190036101400190a16000338284610fb9878a61173d565b610fc3919061173d565b610fcd919061173d565b604051600081818185875af1925050503d8060008114611009576040519150601f19603f3d011682016040523d82523d6000602084013e61100e565b606091505b50506001546040519192506000916001600160a01b039091169086908381818185875af1925050503d8060008114611062576040519150601f19603f3d011682016040523d82523d6000602084013e611067565b606091505b5050905060008a6001600160a01b03168560405160006040518083038185875af1925050503d80600081146110b8576040519150601f19603f3d011682016040523d82523d6000602084013e6110bd565b606091505b505090508280156110cb5750815b80156110d45750805b6110f157604051634a66f90360e01b815260040160405180910390fd5b5050505050505050505050565b6001600160a01b038116600090815260076020526040812054610631906001610b63565b60008281526020819052604090206001015461113d8161122a565b6107378383611237565b600080611153836110fe565b90506000670de0b6b3a76400006002548361116e9190611704565b611178919061171b565b90506000670de0b6b3a7640000600354846111939190611704565b61119d919061171b565b90506000670de0b6b3a7640000600454856111b89190611704565b6111c2919061171b565b905080826111d08587611750565b6111da9190611750565b610c7a9190611750565b60006111ef8161122a565b50600180547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0392909216919091179055565b6112348133611354565b50565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1615610665576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16610665576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556113103390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1661066557611385816113c7565b6113908360206113d9565b6040516020016113a19291906117a0565b60408051601f198184030181529082905262461bcd60e51b82526107c791600401611821565b60606106316001600160a01b03831660145b606060006113e8836002611704565b6113f3906002611750565b67ffffffffffffffff81111561140b5761140b611854565b6040519080825280601f01601f191660200182016040528015611435576020820181803683370190505b5090507f30000000000000000000000000000000000000000000000000000000000000008160008151811061146c5761146c61186a565b60200101906001600160f81b031916908160001a9053507f7800000000000000000000000000000000000000000000000000000000000000816001815181106114b7576114b761186a565b60200101906001600160f81b031916908160001a90535060006114db846002611704565b6114e6906001611750565b90505b600181111561156b577f303132333435363738396162636465660000000000000000000000000000000085600f16601081106115275761152761186a565b1a60f81b82828151811061153d5761153d61186a565b60200101906001600160f81b031916908160001a90535060049490941c9361156481611880565b90506114e9565b508315610ce35760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016107c7565b6000602082840312156115cc57600080fd5b81357fffffffff0000000000000000000000000000000000000000000000000000000081168114610ce357600080fd5b80356001600160a01b038116811461161357600080fd5b919050565b60006020828403121561162a57600080fd5b610ce3826115fc565b6000806040838503121561164657600080fd5b61164f836115fc565b946020939093013593505050565b60006020828403121561166f57600080fd5b5035919050565b6000806040838503121561168957600080fd5b82359150611699602084016115fc565b90509250929050565b600080604083850312156116b557600080fd5b50508035926020909101359150565b600080604083850312156116d757600080fd5b6116e0836115fc565b9150611699602084016115fc565b634e487b7160e01b600052601160045260246000fd5b8082028115828204841417610631576106316116ee565b60008261173857634e487b7160e01b600052601260045260246000fd5b500490565b81810381811115610631576106316116ee565b80820180821115610631576106316116ee565b600060018201611775576117756116ee565b5060010190565b60005b8381101561179757818101518382015260200161177f565b50506000910152565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516117d881601785016020880161177c565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000601791840191820152835161181581602884016020880161177c565b01602801949350505050565b602081526000825180602084015261184081604085016020870161177c565b601f01601f19169190910160400192915050565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b60008161188f5761188f6116ee565b50600019019056fea2646970667358221220d7e3191e6eac8e4ce43c28c685c739136fb7639254e7a24e4094fdbf9c065a0e64736f6c63430008130033";

type BuilderFiV1ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BuilderFiV1ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BuilderFiV1__factory extends ContractFactory {
  constructor(...args: BuilderFiV1ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<BuilderFiV1> {
    return super.deploy(_owner, overrides || {}) as Promise<BuilderFiV1>;
  }
  override getDeployTransaction(
    _owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_owner, overrides || {});
  }
  override attach(address: string): BuilderFiV1 {
    return super.attach(address) as BuilderFiV1;
  }
  override connect(signer: Signer): BuilderFiV1__factory {
    return super.connect(signer) as BuilderFiV1__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BuilderFiV1Interface {
    return new utils.Interface(_abi) as BuilderFiV1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BuilderFiV1 {
    return new Contract(address, _abi, signerOrProvider) as BuilderFiV1;
  }
}
