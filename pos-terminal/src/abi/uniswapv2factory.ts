export const uniswapV2FactoryAbi = [
  {
    inputs: [{ name: "_feeToSetter", type: "address" }],
    stateMutability: "Nonpayable",
    type: "Constructor",
  },
  {
    inputs: [
      { indexed: true, name: "token0", type: "address" },
      { indexed: true, name: "token1", type: "address" },
      { name: "pair", type: "address" },
      { type: "uint256" },
    ],
    name: "PairCreated",
    type: "Event",
  },
  {
    outputs: [{ type: "bytes32" }],
    constant: true,
    name: "INIT_CODE_HASH",
    stateMutability: "View",
    type: "Function",
  },
  {
    outputs: [{ type: "address" }],
    constant: true,
    inputs: [{ type: "uint256" }],
    name: "allPairs",
    stateMutability: "View",
    type: "Function",
  },
  {
    outputs: [{ type: "uint256" }],
    constant: true,
    name: "allPairsLength",
    stateMutability: "View",
    type: "Function",
  },
  {
    outputs: [{ name: "pair", type: "address" }],
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
    ],
    name: "createPair",
    stateMutability: "Nonpayable",
    type: "Function",
  },
  {
    outputs: [{ type: "address" }],
    constant: true,
    name: "feeTo",
    stateMutability: "View",
    type: "Function",
  },
  {
    outputs: [{ type: "address" }],
    constant: true,
    name: "feeToSetter",
    stateMutability: "View",
    type: "Function",
  },
  {
    outputs: [{ type: "address" }],
    constant: true,
    inputs: [{ type: "address" }, { type: "address" }],
    name: "getPair",
    stateMutability: "View",
    type: "Function",
  },
  {
    inputs: [{ name: "_feeTo", type: "address" }],
    name: "setFeeTo",
    stateMutability: "Nonpayable",
    type: "Function",
  },
  {
    inputs: [{ name: "_feeToSetter", type: "address" }],
    name: "setFeeToSetter",
    stateMutability: "Nonpayable",
    type: "Function",
  },
];
