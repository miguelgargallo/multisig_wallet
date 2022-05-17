import { useState, useEffect } from "react";
import { useNetwork, useAccount, useContractRead } from "wagmi";
import { useIsMounted } from "../hooks";
import { constants } from "ethers";

const useIsContractOwner = (contractAddress, contractABI) => {
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
    data: ContractOwner,
    isError: isErrorContractOwner,
    isLoading: isLoadingContractOwner,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "owner",
    {
      enabled: Boolean(
        activeChain &&
          account &&
          contractAddress !== constants.AddressZero &&
          runOwner
      ),
      watch: true,
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
    isErrorContractOwner ||
    isLoadingAccount ||
    isLoadingContractOwner
  ) {
    return {
      ContractOwner: ContractOwner,
      isOwner: false,
    };
  }
  return {
    ContractOwner: ContractOwner,
    isOwner: account?.address === ContractOwner,
  };
};

export default useIsContractOwner;
