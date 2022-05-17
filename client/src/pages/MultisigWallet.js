import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";

import {
  useNetwork,
  useAccount,
  useBalance,
  useContractWrite,
  useContractRead,
  useToken,
} from "wagmi";

import { BigNumber, constants, utils } from "ethers";

import { useIsMounted, useIsOwner, useGetTransactionsCount } from "../hooks";
import { SupportedNetworks, GetContract, GetStatusIcon } from "../components";

const Multisig = () => {
  const isMounted = useIsMounted();
  const { activeChain } = useNetwork();
  const [disabled, setDisabled] = useState(false);

  const { contractAddress, contractABI } = GetContract("MultiSigWallet");

  const {
    data: account,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
  } = useAccount({
    enabled: Boolean(activeChain && contractAddress !== constants.AddressZero),
  });

  const {
    data: numConfirmationsRequired,
    error: errornumConfirmationsRequired,
    isError: isErrornumConfirmationsRequired,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "numConfirmationsRequired",
    {
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );

  const isOwner = useIsOwner(activeChain, contractAddress, contractABI);
  const transactionsCount = useGetTransactionsCount(
    activeChain,
    contractAddress,
    contractABI
  );

  if (!isMounted) return <>not mounted</>;
  if (!activeChain) return <SupportedNetworks />;
  if (contractAddress === constants.AddressZero)
    return (
      <div>Contract not deployed on this network : {activeChain?.name}</div>
    );
  if (isErrorAccount) return <div>Error loading account</div>;
  if (isLoadingAccount) return <div>Loading account…</div>;

  return (
    <>
      <Grid container direction="row" spacing={2} className="container">
        <Grid item>
          <Box component="form" noValidate autoComplete="off" className="form">
            <Typography>Multisig wallet</Typography>
            <Typography color={isOwner ? "blue" : "text.primary"}>
              Address: {contractAddress} {isOwner ? "(owner)" : ""}
            </Typography>
            <Typography>
              numConfirmationsRequired: {numConfirmationsRequired.toString()}
            </Typography>
            <Typography>
              Transactions : {transactionsCount.toString()}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          {isErrornumConfirmationsRequired && (
            <Typography color="red">
              {isErrornumConfirmationsRequired && (
                <>Num:{errornumConfirmationsRequired?.message}</>
              )}
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Multisig;
