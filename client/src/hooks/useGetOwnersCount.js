import { useContractRead } from "wagmi";
import { BigNumber, constants } from "ethers";

const useGetOwnersCount = (_activeChain, _contractAddress, _contractABI) => {
  const {
    data: transactionsCount,
    isError: isErrortransactionsCount,
    isLoading: isLoadingtransactionsCount,
  } = useContractRead(
    {
      addressOrName: _contractAddress,
      contractInterface: _contractABI,
    },
    "getOwnersCount",
    {
      watch: true,
      enabled: Boolean(
        _activeChain && _contractAddress !== constants.AddressZero
      ),
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

export default useGetOwnersCount;
