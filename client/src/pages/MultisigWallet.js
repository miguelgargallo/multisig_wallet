import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
  useNetwork,
  useAccount,
  useBalance,
  useContractWrite,
  useContractRead,
  useSendTransaction,
} from "wagmi";

import { BigNumber, constants, utils } from "ethers";
import { shortenAddress } from "../utils/utils";
import { useGetTransactionsCount, useGetOwnersCount } from "../hooks";
import {
  SupportedNetworks,
  GetContract,
  GetContractTestContract,
  GetTransaction,
  GetOwner,
  GetStatusIcon,
} from "../components";
import { useIsMounted } from "../hooks";

const Multisig = () => {
  const isMounted = useIsMounted();
  const { activeChain } = useNetwork();
  const [disabled, setDisabled] = useState(false);

  const { contractAddress, contractABI } = GetContract("MultiSigWallet");
  const { contractAddress: contractAddressTest, contractABI: contractABITest } =
    GetContractTestContract("TestContract");
  const ifaceContractTest = new utils.Interface(contractABITest);
  const [address, setAddress] = useState(contractAddressTest);
  const [param1, setParam1] = useState("0");
  const [param2, setParam2] = useState("0");
  const [value1, setValue1] = useState("0");
  const {
    data: account,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
  } = useAccount({
    enabled: Boolean(activeChain && contractAddress !== constants.AddressZero),
  });

  const { data: numConfirmationsRequired } = useContractRead(
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
  const { data: balanceContract } = useBalance({
    addressOrName: contractAddress,
    watch: true,
    enabled: Boolean(
      activeChain && account && contractAddress !== constants.AddressZero
    ),
  });

  const {
    error: errorFundContract,
    status: statusFundContract,
    isLoading: isLoadingFundContract,
    sendTransaction: FundContract,
  } = useSendTransaction({
    enabled: Boolean(
      activeChain && account && contractAddress !== constants.AddressZero
    ),
  });

  const {
    error: errorSubmit,
    isError: isErrorSubmit,
    isLoading: isLoadingSubmit,
    write: writeSubmit,
    status: statusSubmit,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "submitTransaction",
    {
      enabled: Boolean(
        activeChain && account && contractAddress !== constants.AddressZero
      ),
    }
  );

  const transactionsCount = useGetTransactionsCount(
    activeChain,
    contractAddress,
    contractABI
  );
  const ownersCount = useGetOwnersCount(
    activeChain,
    contractAddress,
    contractABI
  );

  const TransactionsArray = [
    ...Array.from(
      { length: parseInt(transactionsCount) },
      (_, idx) => `${++idx}`
    ),
  ];
  const ownersArray = [
    ...Array.from({ length: parseInt(ownersCount) }, (_, idx) => `${++idx}`),
  ];
  const handleValue = (e) => {
    try {
      const localvalue = utils.parseEther(e.currentTarget.value);
      if (localvalue >= 0) {
        setValue1(e.currentTarget.value);
      }
    } catch (error) {
      setValue1("");
    }
  };
  const handleClick = () => {
    if (
      address &&
      address !== "" &&
      value1 &&
      value1 !== "0" &&
      parseFloat(value1) > 0
    ) {
      setDisabled(true);
      const data = ifaceContractTest.encodeFunctionData("callMe", [
        BigNumber.from(param1),
        BigNumber.from(param2),
      ]);
      writeSubmit({
        args: [address, BigNumber.from(utils.parseUnits(value1, "gwei")), data],
      });
      setDisabled(false);
      setValue1("");
      setParam1("");
      setParam2("");
      setAddress(contractAddressTest);
    }
  };

  //  useEffect(() => {}, [handleClick, handleValue]);

  const fundContract = () => {
    setDisabled(true);
    FundContract({
      request: { to: contractAddress, value: utils.parseUnits("5", "gwei") },
    });
    setDisabled(false);
  };

  const handleParam1 = (e) => {
    try {
      const value = utils.parseEther(e.currentTarget.value);
      if (value >= 0) {
        setParam1(e.currentTarget.value);
      }
    } catch (error) {
      setParam1("");
    }
  };
  const handleParam2 = (e) => {
    try {
      const value = utils.parseEther(e.currentTarget.value);
      if (value >= 0) {
        setParam2(e.currentTarget.value);
      }
    } catch (error) {
      setParam2("");
    }
  };

  const testContracts = [
    {
      value: contractAddressTest,
      label: "TestContract.callMe(uint256 j, uint256 a)",
    },
  ];
  if (!isMounted) return <></>;
  if (!activeChain) return <SupportedNetworks />;
  if (isLoadingAccount) return <div>Loading account…</div>;
  if (isErrorAccount) return <div>Error loading account</div>;
  if (contractAddress === constants.AddressZero)
    return (
      <div>Contract not deployed on this network : {activeChain?.name}</div>
    );

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item>
        <Paper elevation={4}>
          <Typography>
            Contract Address: {shortenAddress(contractAddress)}
          </Typography>
          <Typography>
            RequiredConfirmations: {numConfirmationsRequired?.toString()}
          </Typography>
          <Typography>
            Balance: {balanceContract?.formatted} ETH{" "}
            <Button
              variant="outlined"
              size="small"
              onClick={fundContract}
              disabled={disabled}
            >
              Fund Contract (with 5 gwei)
            </Button>
          </Typography>
          <Typography>Owners</Typography>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="owners">
              <TableBody>
                {ownersArray?.map((owner, index) => {
                  return (
                    <GetOwner
                      key={index}
                      index={index}
                      activeChain={activeChain}
                      contractAddress={contractAddress}
                      contractABI={contractABI}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography>Transactions</Typography>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="transactions">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Tx</TableCell>
                  <TableCell align="left">To(Contract)</TableCell>
                  <TableCell align="left">Data</TableCell>
                  <TableCell align="left">Executed</TableCell>
                  <TableCell align="left">Confirmations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {TransactionsArray.map((transaction, index) => {
                  return (
                    <GetTransaction
                      key={index}
                      index={index}
                      numConfirmationsRequired={numConfirmationsRequired}
                      iface={ifaceContractTest}
                      activeChain={activeChain}
                      contractAddress={contractAddress}
                      contractABI={contractABI}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid item>
        <Paper elevation={4}>
          <Typography>Submit a transaction</Typography>
          <div>
            <TextField
              fullWidth
              helperText="Choose the TestContract address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={disabled}
              select
            >
              {testContracts.map((fnCall) => (
                <MenuItem key={fnCall.value} value={fnCall.value}>
                  {fnCall.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div>
            <TextField
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              variant="standard"
              type="text"
              required
              margin="normal"
              label="Value (in gwei)"
              value={value1}
              onChange={handleValue}
              disabled={disabled}
            />
          </div>
          <div>
            <TextField
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              variant="standard"
              type="text"
              required
              margin="normal"
              label="Parameter 1"
              value={param1}
              onChange={handleParam1}
              disabled={disabled}
            />
          </div>
          <div>
            <TextField
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              variant="standard"
              type="text"
              required
              margin="normal"
              label="Parameter 2"
              value={param2}
              onChange={handleParam2}
              disabled={disabled}
            />
          </div>
          <div>
            <Button
              variant="contained"
              onClick={handleClick}
              disabled={disabled}
            >
              Submit Transaction
            </Button>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Multisig;
