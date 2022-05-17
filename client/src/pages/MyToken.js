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

import { constants, utils } from "ethers";

import { useIsMounted, useIsContractOwner } from "../hooks";
import {
  SupportedNetworks,
  GetContract,
  GetStatusIcon,
  GraphMyToken,
} from "../components";

const MyToken = () => {
  const isMounted = useIsMounted();
  const { activeChain } = useNetwork();
  const [value, setValue] = useState("0");
  const [toAddress, setToAddress] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { contractAddress, contractABI } = GetContract("MyToken");

  const {
    data: account,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
  } = useAccount({
    enabled: Boolean(activeChain && contractAddress !== constants.AddressZero),
  });

  const { data: token, refetch: refetchBalance } = useToken({
    address: contractAddress,
    enabled: Boolean(
      activeChain && account && contractAddress !== constants.AddressZero
    ),
  });

  const { isOwner, ContractOwner } = useIsContractOwner(
    contractAddress,
    contractABI
  );

  const {
    data: balance,
    isError: isErrorBalance,
    isLoading: isLoadingBalance,
  } = useBalance({
    addressOrName: account?.address,
    token: contractAddress,
    watch: true,
    enabled: Boolean(
      activeChain && account && contractAddress !== constants.AddressZero
    ),
  });

  const {
    data: allowance,
    error: errorAllowance,
    isError: isErrorAllowance,
    refetch: getAllowance,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "allowance",
    {
      watch: true,
      args: [ContractOwner, account?.address],
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );

  const {
    error: errorIncreaseAllowance,
    isError: isErrorIncreaseAllowance,
    isLoading: isLoadingIncreaseAllowance,
    write: writeIncreaseAllowance,
    status: statusIncreaseAllowance,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "increaseAllowance",
    {
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );

  const {
    error: errorDecreaseAllowance,
    isError: isErrorDecreaseAllowance,
    isLoading: isLoadingDecreaseAllowance,
    write: writeDecreaseAllowance,
    status: statusDecreaseAllowance,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "decreaseAllowance",
    {
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );

  const {
    error: errorMint,
    isError: isErrorMint,
    isLoading: isLoadingMint,
    write: writeMint,
    status: statusMint,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "mint",
    {
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );

  const {
    error: errorApprove,
    isError: isErrorApprove,
    isLoading: isLoadingApprove,
    write: writeApprove,
    status: statusApprove,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "approve",
    {
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );

  const {
    error: errorBurn,
    isError: isErrorBurn,
    isLoading: isLoadingBurn,
    write: writeBurn,
    status: statusBurn,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "burn",
    {
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );

  const {
    error: errorBurnFrom,
    isError: isErrorBurnFrom,
    isLoading: isLoadingBurnFrom,
    write: writeBurnFrom,
    status: statusBurnFrom,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "burnFrom",
    {
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );

  const {
    error: errorTransferOwnership,
    isError: isErrorTransferOwnership,
    isLoading: isLoadingTransferOwnership,
    write: writeTransferOwnership,
    status: statusTransferOwnership,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "transferOwnership",
    {
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );

  useEffect(() => {
    if (statusApprove !== "loading") {
      setDisabled(false);
      setValue("0");
      setToAddress("");
    }
  }, [statusApprove]);

  useEffect(() => {
    if (statusMint !== "loading") {
      setDisabled(false);
      setValue("0");
      setToAddress("");
    }
  }, [statusMint]);

  useEffect(() => {
    if (statusBurn !== "loading") {
      setDisabled(false);
      setValue("0");
      setToAddress("");
    }
  }, [statusBurn]);

  useEffect(() => {
    if (statusBurnFrom !== "loading") {
      setDisabled(false);
      setValue("0");
      setToAddress("");
    }
  }, [statusBurnFrom]);

  useEffect(() => {
    if (statusTransferOwnership !== "loading") {
      setDisabled(false);
      setValue("0");
      setToAddress("");
    }
  }, [statusTransferOwnership]);

  useEffect(() => {
    if (statusIncreaseAllowance !== "loading") {
      setDisabled(false);
      setValue("0");
      setToAddress("");
    }
  }, [statusIncreaseAllowance]);
  useEffect(() => {
    if (statusDecreaseAllowance !== "loading") {
      setDisabled(false);
      setValue("0");
      setToAddress("");
    }
  }, [statusDecreaseAllowance]);

  const handleIncreaseAllowance = (e) => {
    e.preventDefault();
    if (toAddress && value && utils.parseEther(value) > 0) {
      writeIncreaseAllowance({
        args: [
          toAddress ? toAddress : account?.address,
          utils.parseEther(value),
        ],
      });
      setValue("0");
      setToAddress("");
    }
  };
  const handleDecreaseAllowance = (e) => {
    e.preventDefault();
    if (toAddress && value && utils.parseEther(value) > 0) {
      writeDecreaseAllowance({
        args: [
          toAddress ? toAddress : account?.address,
          utils.parseEther(value),
        ],
      });
      setValue("0");
      setToAddress("");
    }
  };

  const handleMint = (e) => {
    e.preventDefault();
    if (value && utils.parseEther(value) > 0) {
      writeMint({
        args: [
          toAddress ? toAddress : account?.address,
          utils.parseEther(value),
        ],
      });
      setValue("0");
      setToAddress("");
    }
  };
  const handleApprove = (e) => {
    e.preventDefault();
    if (value && utils.parseEther(value) > 0) {
      writeApprove({
        args: [
          toAddress ? toAddress : account?.address,
          utils.parseEther(value),
        ],
      });
      setValue("0");
      setToAddress("");
    }
  };

  const handleBurn = (e) => {
    e.preventDefault();
    if (value && utils.parseEther(value) > 0) {
      if (!toAddress) {
        writeBurn({
          args: [utils.parseEther(value)],
        });
      } else {
        writeBurnFrom({
          args: [
            toAddress ? toAddress : account?.address,
            utils.parseEther(value),
          ],
        });
      }
      setValue("0");
      setToAddress("");
    }
  };

  const handleTransferOwnership = (e) => {
    e.preventDefault();
    if (toAddress) {
      writeTransferOwnership({
        args: [toAddress ? toAddress : account?.address],
      });
      setValue("0");
      setToAddress("");
    }
  };

  useEffect(() => {
    if (activeChain && account && contractAddress !== constants.AddressZero) {
      refetchBalance();
    }
    if (ContractOwner && account) {
      getAllowance();
    }
    // eslint-disable-next-line
  }, [account, balance]);

  if (!isMounted) return <>not mounted</>;
  if (!activeChain) return <SupportedNetworks />;
  if (contractAddress === constants.AddressZero)
    return (
      <div>Contract not deployed on this network : {activeChain?.name}</div>
    );
  if (isErrorAccount || isErrorBalance)
    return <div>Error fetching balance</div>;
  if (isLoadingBalance || isLoadingAccount) return <div>Fetching balance…</div>;

  return (
    <>
      <Grid container direction="row" spacing={2} className="container">
        <Grid item>
          <Box component="form" noValidate autoComplete="off" className="form">
            <Typography>
              Mint MyToken, TotalSupply :{token?.totalSupply?.formatted}{" "}
              {token?.symbol}
            </Typography>
            <Typography color={isOwner ? "blue" : "text.primary"}>
              Address: {account?.address} {isOwner && <>(token owner)</>}
            </Typography>
            <Typography>
              Your balance: {balance?.formatted} {balance?.symbol}, Allowance:{" "}
              <IconButton
                aria-label="Decrease Allowance"
                variant="contained"
                size="small"
                color="primary"
                onClick={handleDecreaseAllowance}
                disabled={isLoadingDecreaseAllowance}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              {allowance && <>{utils.formatEther(allowance?.toString())}</>}
              <IconButton
                aria-label="Increase Allowance"
                variant="contained"
                size="small"
                color="primary"
                onClick={handleIncreaseAllowance}
                disabled={isLoadingIncreaseAllowance}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Typography>
            <Grid container direction="row" spacing={2} className="container">
              <Grid item>
                <Grid
                  container
                  direction="column"
                  spacing={2}
                  className="container"
                >
                  <Grid item>
                    <TextField
                      fullWidth
                      helperText="Please enter a valid ETH address"
                      variant="standard"
                      type="text"
                      margin="normal"
                      label="Address? (empty if owner)"
                      value={toAddress}
                      onChange={(e) => setToAddress(e.currentTarget.value)}
                      disabled={disabled}
                    />
                    <div>
                      <TextField
                        helperText="How many tokens?"
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        variant="standard"
                        type="text"
                        required
                        margin="normal"
                        label="Amount"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={disabled}
                      />
                    </div>
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      direction="row"
                      spacing={2}
                      className="container"
                    >
                      <Grid item>
                        <Button
                          variant="contained"
                          onClick={handleMint}
                          disabled={isLoadingMint}
                          endIcon={<GetStatusIcon status={statusMint} />}
                        >
                          Mint
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          onClick={handleBurn}
                          disabled={isLoadingBurn && isLoadingBurnFrom}
                          endIcon={<GetStatusIcon status={statusBurn} />}
                        >
                          Burn
                          <GetStatusIcon status={statusBurnFrom} />
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          onClick={handleApprove}
                          disabled={isLoadingApprove}
                          endIcon={<GetStatusIcon status={statusApprove} />}
                        >
                          Approve
                        </Button>
                      </Grid>
                      {isOwner && (
                        <Grid item>
                          <Button
                            variant="contained"
                            onClick={handleTransferOwnership}
                            disabled={isLoadingTransferOwnership}
                            endIcon={<GetStatusIcon status={statusApprove} />}
                          >
                            Transfer Ownership
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                    <Grid item>
                      {(isErrorMint ||
                        isErrorBurn ||
                        isErrorBurnFrom ||
                        isErrorApprove ||
                        isErrorTransferOwnership ||
                        isErrorAllowance ||
                        isErrorIncreaseAllowance ||
                        isErrorDecreaseAllowance) && (
                        <Typography color="red">
                          {isErrorMint && <>Mint:{errorMint?.reason}</>}
                          {isErrorBurn && <>Burn:{errorBurn?.reason}</>}
                          {isErrorBurnFrom && (
                            <>BurnFrom:{errorBurnFrom?.reason}</>
                          )}
                          {isErrorApprove && (
                            <>Approve:{errorApprove?.reason}</>
                          )}
                          {isErrorTransferOwnership && (
                            <>
                              Approve:
                              {errorTransferOwnership?.reason}
                            </>
                          )}
                          {isErrorAllowance && (
                            <>Approve:{errorAllowance?.reason}</>
                          )}
                          {isErrorIncreaseAllowance && (
                            <>
                              Increase Allowance:
                              {errorIncreaseAllowance?.reason}
                            </>
                          )}
                          {isErrorDecreaseAllowance && (
                            <>
                              Decrease Allowance:
                              {errorDecreaseAllowance?.reason}
                            </>
                          )}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item>
          <Box component="form" noValidate autoComplete="off" className="form">
            <GraphMyToken />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default MyToken;
