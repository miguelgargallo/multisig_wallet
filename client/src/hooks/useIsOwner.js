import { useState, useEffect } from "react";
import { useNetwork, useAccount, useContractRead } from "wagmi";
import { useIsMounted } from "../hooks";
import { constants } from "ethers";

const useIsOwner = (contractAddress, contractABI) => {
  const isMounted = useIsMounted();
  const [runOwner, setRunOwner] = useState(false);
  const { activeChain } = useNetwork();
  const {
    data: account,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
  } = useAccount({
    enabled: Boolean(activeChain && contractAddress !== constants.AddressZero),
  });

  const {
    data: isOwner,
    isError: isErrorisOwner,
    isLoading: isLoadingisOwner,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "isOwner",
    {
      args: [account?.address],
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );
  useEffect(() => {
    if (!runOwner) setRunOwner(true);
    // eslint-disable-next-line
  }, [account, contractAddress]);

  if (
    !isMounted ||
    !activeChain ||
    !account ||
    isErrorAccount ||
    isErrorisOwner ||
    isLoadingAccount ||
    isLoadingisOwner
  ) {
    return false;
  }
  return isOwner;
};

export default useIsOwner;
