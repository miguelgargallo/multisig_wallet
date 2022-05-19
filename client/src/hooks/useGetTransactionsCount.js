import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { addressNotZero } from "../utils/utils";

const useGetTransactionsCount = (activeChain, contractAddress, contractABI) => {
  const {
    data: transactionsCount,
    isError: isErrortransactionsCount,
    isLoading: isLoadingtransactionsCount,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "getTransactionCount",
    {
      watch: Boolean(activeChain && addressNotZero(contractAddress)),
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  if (
    isErrortransactionsCount ||
    isLoadingtransactionsCount ||
    !transactionsCount
  )
    return BigNumber.from("0");

  return transactionsCount;
};

export default useGetTransactionsCount;
