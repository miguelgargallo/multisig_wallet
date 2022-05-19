import { useNetwork } from "wagmi";
import { constants, utils } from "ethers";

import contractTestContract from "../chain-info/TestContract.json";
import networkMapping from "../chain-info/map.json";

const GetContractTestContract = (contractName) => {
  const { activeChain } = useNetwork();
  let contractAddress;

  if (!networkMapping[String(activeChain?.id)]) {
    contractAddress = constants.AddressZero;
  } else {
    contractAddress = activeChain?.id
      ? networkMapping[String(activeChain.id)][contractName][0]
      : constants.AddressZero;
  }

  const { abi } = contractTestContract;

  if (!activeChain)
    return { contractAddress: constants.AddressZero, contractABI: abi };
  const formattedAddress = utils.getAddress(contractAddress);
  return { contractAddress: formattedAddress, contractABI: abi };
};

export default GetContractTestContract;
