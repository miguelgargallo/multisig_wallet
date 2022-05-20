import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Paper } from "@mui/material";

import { utils } from "ethers";
import { addressNotZero } from "../utils/utils";

import { useBalance, useSendTransaction } from "wagmi";
import { useIsMounted, useGetConfReq } from "../hooks";
import { GetStatusIcon, ShowError } from "../components";

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
    //isLoadingBalance,
    isError: isErrorBalance,
    isSuccess: isSuccessBalance,
    error: errorBalance,
    status: statusBalance,
  } = useBalance({
    addressOrName: contractAddress,
    watch: true,
    enabled: Boolean(activeChain && account && addressNotZero(contractAddress)),
  });

  const requiredConfirmations = useGetConfReq(
    activeChain,
    contractAddress,
    contractABI
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
    if (statusFundContract !== "loading") {
      if (disabled) setDisabled(false);
    }
    // eslint-disable-next-line
  }, [statusBalance, statusFundContract]);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      padding={1}
    >
      {isMounted && (
        <Paper>
          <Typography>Contract Address: {contractAddress}</Typography>
          <Typography>
            Required Confirmations: from {requiredConfirmations?.toString()}{" "}
            owner(s)
          </Typography>
          {isSuccessBalance && (
            <>
              <Typography>Balance: {balance?.formatted} ETH </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleFundContract}
                disabled={disabled || isLoadingFundContract}
                endIcon={<GetStatusIcon status={statusFundContract} />}
              >
                Fund Contract (with 5 gwei)
              </Button>
            </>
          )}
          {isErrorBalance && (
            <ShowError flag={isErrorBalance} error={errorBalance} />
          )}
          {isErrorFundContract && (
            <ShowError flag={isErrorFundContract} error={errorFundContract} />
          )}
        </Paper>
      )}
    </Stack>
  );
};

export default GetMutisigContract;