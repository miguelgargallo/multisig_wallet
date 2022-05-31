import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { addressNotZero } from "../utils/utils";

const useGetOwnersCount = (activeChain, contractAddress, contractABI) => {
  const isEnabled = Boolean(activeChain && addressNotZero(contractAddress));
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
      watch: isEnabled,
      enabled: isEnabled,
    }
  );

  if (isLoadingTxCount || isErrorTxCount || !isSuccessTxCount)
    return BigNumber.from("0");

  return txCount;
};

export default useGetOwnersCount;
