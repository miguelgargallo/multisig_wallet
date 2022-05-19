import { useNetwork } from "wagmi";
import { constants, utils } from "ethers";

import networkMapping from "../chain-info/map.json";

import contractMultisigWallet from "../chain-info/MultiSigWallet.json";
import contractTestContract from "../chain-info/TestContract.json";

const GetContract = (contractName) => {
  const { activeChain } = useNetwork();
  let contractAddress;

  if (!networkMapping[String(activeChain?.id)]) {
    contractAddress = constants.AddressZero;
  } else {
    contractAddress = activeChain?.id
      ? networkMapping[String(activeChain.id)][contractName][0]
      : constants.AddressZero;
  }

  const { abi: abiMultisignWallet } = contractMultisigWallet;
  const { abi: abiTestContract } = contractTestContract;

  const formattedAddress = utils.getAddress(contractAddress);

  if (contractName === "MultiSigWallet") {
    return {
      contractAddress: activeChain ? formattedAddress : constants.AddressZero,
      contractABI: abiMultisignWallet,
    };
  }
  if (contractName === "TestContract") {
    return {
      contractAddress: activeChain ? formattedAddress : constants.AddressZero,
      contractABI: abiTestContract,
    };
  }
  return { contractAddress: formattedAddress, contractABI: abiMultisignWallet };
};

export default GetContract;
