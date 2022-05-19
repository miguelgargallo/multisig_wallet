import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { addressNotZero } from "../utils/utils";

const useGetConfReq = (activeChain, contractAddress, contractABI) => {
  const {
    data: confReq,
    isLoading: isLoadingConfReq,
    isError: isErrorConfReq,
    isSuccess: isSuccessConfReq,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "numConfirmationsRequired",
    {
      watch: Boolean(activeChain && addressNotZero(contractAddress)),
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  if (isLoadingConfReq || isErrorConfReq || !isSuccessConfReq)
    return BigNumber.from("0");

  return confReq;
};

export default useGetConfReq;
