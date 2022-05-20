import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { useNetwork, useAccount } from "wagmi";
import { addressNotZero } from "../utils/utils";

import {
  SupportedNetworks,
  GetContract,
  GetTransactions,
  GetOwners,
  GetMultisigContract,
  GraphMultisignWallet,
  SubmitTransaction,
} from "../components";
import { useIsMounted } from "../hooks";

const Multisig = () => {
  const isMounted = useIsMounted();
  const { activeChain } = useNetwork();

  const { contractAddress, contractABI } = GetContract("MultiSigWallet");
  const {
    data: account,
    error: errorAccount,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
  } = useAccount({
    enabled: Boolean(activeChain && addressNotZero(contractAddress)),
  });

  if (!activeChain) return <SupportedNetworks />;
  if (isLoadingAccount) return <div>Loading account…</div>;
  if (isErrorAccount)
    return <div>Error loading account: {errorAccount?.message}</div>;
  if (!addressNotZero(contractAddress))
    return (
      <div>Contract not deployed on this network : {activeChain?.name}</div>
    );

  return (
    <>
      {isMounted && (
        <Grid container direction="row" padding={1} spacing={1}>
          <Grid item>
            <Paper elevation={4}>
              <GetMultisigContract
                activeChain={activeChain}
                contractAddress={contractAddress}
                contractABI={contractABI}
                account={account}
              />
              <GetOwners
                activeChain={activeChain}
                contractAddress={contractAddress}
                contractABI={contractABI}
                account={account}
              />
              <GetTransactions
                activeChain={activeChain}
                contractAddress={contractAddress}
                contractABI={contractABI}
              />
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={4}>
              <SubmitTransaction
                activeChain={activeChain}
                contractAddress={contractAddress}
                contractABI={contractABI}
                account={account}
              />
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={4}>
              <GraphMultisignWallet />
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Multisig;
