import { useState, useEffect } from "react";
import { useNetwork, useAccount, useContractRead } from "wagmi";
import { constants } from "ethers";

const useIsContractOwner = (_contractAddress, _contractABI) => {
  const [runOwner, setRunOwner] = useState(false);
  const { activeChain } = useNetwork();

  const {
    data: account,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
  } = useAccount({
    enabled: Boolean(activeChain && _contractAddress !== constants.AddressZero),
  });
  const {
    data: ContractOwner,
    isError: isErrorContractOwner,
    isLoading: isLoadingContractOwner,
  } = useContractRead(
    {
      addressOrName: _contractAddress,
      contractInterface: _contractABI,
    },
    "owner",
    {
      enabled: Boolean(
        activeChain &&
          account &&
          _contractAddress !== constants.AddressZero &&
          runOwner
      ),
      watch: true,
    }
  );

  useEffect(() => {
    if (!runOwner) setRunOwner(true);
    // eslint-disable-next-line
  }, [account, _contractAddress]);

  if (
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
