import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { addressNotZero } from "../utils/utils";

const useGetOwnersCount = (activeChain, contractAddress, contractABI) => {
  const {
    data: txCount,
    isLoading: isLoadingTxCount,
    isError: isErrorTxCount,
    isSuccess: isSuccessTxCount,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "getOwnersCount",
    {
      watch: Boolean(activeChain && addressNotZero(contractAddress)),
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  if (isLoadingTxCount || isErrorTxCount || !isSuccessTxCount)
    return BigNumber.from("0");

  return txCount;
};

export default useGetOwnersCount;
