import { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import { constants } from "ethers";

const useIsOwner = (_activeChain, _contractAddress, _contractABI) => {
  const {
    data: account,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
  } = useAccount({
    enabled: Boolean(
      _activeChain && _contractAddress !== constants.AddressZero
    ),
  });

  const {
    data: isOwner,
    isError: isErrorisOwner,
    isLoading: isLoadingisOwner,
  } = useContractRead(
    {
      addressOrName: _contractAddress,
      contractInterface: _contractABI,
    },
    "isOwner",
    {
      args: [account?.address],
      enabled: Boolean(
        _activeChain && account && _contractAddress !== constants.AddressZero
      ),
    }
  );
  if (
    !_activeChain ||
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
