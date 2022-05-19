import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { utils } from "ethers";
import { shortenAddress, addressNotZero } from "../utils/utils";

import { useBalance, useContractRead, useSendTransaction } from "wagmi";
import { ShowError } from "./";
import { useIsMounted } from "../hooks";

const GetMutisigContract = ({
  activeChain,
  contractAddress,
  contractABI,
  account,
}) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);

  const {
    data: balance,
    isLoadingBalance,
    isError: isErrorBalance,
    isSuccess: isSuccessBalance,
    error: errorBalance,
    status: statusBalance,
  } = useBalance({
    addressOrName: contractAddress,
    watch: true,
    enabled: Boolean(activeChain && account && addressNotZero(contractAddress)),
  });

  const {
    data: requiredConfirmations,
    isLoading: isLoadingRequiredConfirmations,
    isError: isErrorRequiredConfirmations,
    isSuccess: isSuccessRequiredConfirmations,
    error: errorRequiredConfirmations,
    status: statusRequiredConfirmations,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "numConfirmationsRequired",
    {
      enabled: Boolean(
        activeChain && account && addressNotZero(contractAddress)
      ),
    }
  );

  const {
    error: errorFundContract,
    isLoading: isLoadingFundContract,
    isError: isErrorFundContract,
    sendTransaction: FundContract,
    status: statusFundContract,
  } = useSendTransaction({
    enabled: Boolean(activeChain && account && addressNotZero(contractAddress)),
  });

  const handleFundContract = () => {
    setDisabled(true);
    FundContract({
      request: { to: contractAddress, value: utils.parseUnits("5", "gwei") },
    });
  };

  useEffect(() => {
    if (statusBalance !== "loading") {
      if (disabled) setDisabled(false);
    }
    if (statusRequiredConfirmations !== "loading") {
      if (disabled) setDisabled(false);
    }
    if (statusFundContract !== "loading") {
      if (disabled) setDisabled(false);
    }
  }, [statusBalance, statusRequiredConfirmations, statusFundContract]);

  return (
    <>
      {isMounted && !isLoadingBalance && !isLoadingRequiredConfirmations && (
        <>
          <Typography>
            Contract Address: {shortenAddress(contractAddress)}
          </Typography>
          {isSuccessBalance && (
            <Typography>
              Balance: {balance?.formatted} ETH{" "}
              <Button
                variant="outlined"
                size="small"
                onClick={handleFundContract}
                disabled={disabled || isLoadingFundContract}
              >
                Fund Contract (with 5 gwei)
              </Button>
            </Typography>
          )}
          {isSuccessRequiredConfirmations && (
            <Typography>
              RequiredConfirmations: {requiredConfirmations?.toString()}
            </Typography>
          )}
          <ShowError flag={isErrorBalance} error={errorBalance} />
          <ShowError
            flag={isErrorRequiredConfirmations}
            error={errorRequiredConfirmations}
          />
          <ShowError flag={isErrorFundContract} error={errorFundContract} />
        </>
      )}
    </>
  );
};

export default GetMutisigContract;
