import { useNetwork, useContractRead } from "wagmi";
import { useIsMounted } from "../hooks";
import { BigNumber } from "ethers";

const useGetTransactionsCount = (contractAddress, contractABI) => {
  const isMounted = useIsMounted();
  const { activeChain } = useNetwork();
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
      enabled: Boolean(activeChain),
    }
  );

  if (!isMounted || isErrortransactionsCount || isLoadingtransactionsCount)
    return BigNumber.from("0");

  return transactionsCount;
};

export default useGetTransactionsCount;
