import { Wallet, ethers } from "ethers";
import { vaultFactoryAbi } from "./abi/VaultFactory";
import { vaultAbi } from "./abi/Vault";
import { poSTerminalAbi } from "./abi/PoSTerminal";
import { routerAbi } from "./abi/Router";
import { erc20abi } from "./abi/erc20";

//TODO: fill in new value
const ROUTER = "TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax";

const VAULT = "TSZWybZRCCYrJpbXKqgKofbtisuKjmhPkE";
const VAULT_FACTORY = "TLmXiZVLm4ckLutkTHVuEqEeeXWgCRqfvn";
const POS_TERMINAL = "TGCmHgLSjtyjg8qX3AJDYyPvfcTgjrESxk";

// TODO:
export const USDC = "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8"; // TODO: had added usdc
const USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

const WALLET =
  "ff4f55382dc1dad042411e64cf13eafaa051e78c9f343a3ffab8ce2408b74479";
const WALLET_ADDRESS = "418ce415dcad49fe561475520225b8133f4b1d3289";

export const sendTransaction = async (tronweb) => {
  const amount = ethers.parseUnits("1", 6);
  const tokenAddress = USDC;

  const calldata = ethers.keccak256(
    ethers.toBeArray(
      tronweb.utils.abi.encodeParams(
        ["address", "uint256"],
        [tokenAddress, amount]
      )
    )
  );

  const wallet = new Wallet(WALLET);
  const signature = await wallet.signMessage(ethers.toBeArray(calldata));

  const posTerminalContract = await getPoSTerminal(tronweb);

  const router = new ethers.Interface(routerAbi);
  const secondCall = router.encodeFunctionData("swapExactTokensForTokens", [
    ethers.parseUnits("1", 6),
    ethers.parseUnits("1", 5),
    [
      "0x3487B63D30B5B2C87FB7FFA8BCFADE38EAAC1ABE",
      "0xA614F803B6FD780986A42C78EC9C7F77E6DED13C",
    ],
    "0x44611D18F740434C52956BE876402BDE4FC91065",
    new Date().getTime() + 60 * 60 * 24 * 7,
  ]);
  console.log("reached here", secondCall);

  const tx = await posTerminalContract
    .transferAndCall(VAULT, tokenAddress, amount, signature, ROUTER, secondCall)
    .send();

  console.log("https://tronscan.org/#/transaction/" + tx);
  return tx;
};

export const getVault = async (tronweb) => {
  return tronweb.contract(vaultAbi, VAULT);
};

export const getVaultFactory = async (tronweb) => {
  return tronweb.contract(vaultFactoryAbi, VAULT_FACTORY);
};

export const getPoSTerminal = async (tronweb) => {
  return tronweb.contract(poSTerminalAbi, POS_TERMINAL);
};

export const getErc20 = async (address: string, tronweb) => {
  return tronweb.contract(erc20abi, address);
};

export async function approveTerminal(tronweb) {
  const vaultFactory = await getVaultFactory(tronweb);

  const tx = await vaultFactory.addTerminal(POS_TERMINAL).send();
  console.log("https://tronscan.org/#/transaction/" + tx);
  return tx;
}

export async function approveRouter(tronweb) {
  console.log("start call");

  const posTerminalContract = await getPoSTerminal(tronweb);

  const token = new ethers.Interface(erc20abi);
  const calldata = token.encodeFunctionData("approve", [
    "0x6E0617948FE030A7E4970F8389D4AD295F249B7E",
    ethers.MaxUint256,
  ]);

  const tx = await posTerminalContract.call(USDC, calldata).send();

  console.log("Approve router", "https://tronscan.org/#/transaction/" + tx);
  return tx;
}

// WORKING
export async function approveKey(tronweb) {
  console.log("start");
  const vaultContract = await getVault(tronweb);

  const tx = await vaultContract.updateKey(WALLET_ADDRESS).send();
  console.log("Add card key", "https://tronscan.org/#/transaction/" + tx);
  return tx;
}

export async function deployVault(tronweb) {
  console.log("start");
  const vaultContract = await getVaultFactory(tronweb);

  const tx = await vaultContract.deploy(WALLET_ADDRESS).send({
    feeLimit: ethers.parseUnits("1000", 6),
  });
  console.log("https://tronscan.org/#/transaction/" + tx);
  return tx;
}
