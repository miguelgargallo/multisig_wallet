import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { addressNotZero } from "../utils/utils";

const useGetConfReq = (activeChain, contractAddress, contractABI) => {
  const isEnabled = Boolean(activeChain && addressNotZero(contractAddress));
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
      watch: isEnabled,
      enabled: isEnabled,
    }
  );

  if (isLoadingConfReq || isErrorConfReq || !isSuccessConfReq)
    return BigNumber.from("0");

  return confReq;
};

export default useGetConfReq;
