import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useEffect, useState } from "react";
import { BigNumber, utils } from "ethers";

import { Alert } from "../components";

import { useNetwork, useAccount, useBalance, useSendTransaction } from "wagmi";

const formatter = new Intl.NumberFormat("en-us", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const formatBalance = (balance) =>
  formatter.format(
    parseFloat(utils.formatEther(balance ?? BigNumber.from("0")))
  );

const SendEthForm = () => {
  const [isMounted, setIsMounted] = useState(false);

  const [amount, setAmount] = useState("0");
  const [address, setAddress] = useState("");

  const { activeChain } = useNetwork();
  const { data: account, isError } = useAccount();
  const { data: balance } = useBalance({
    addressOrName: account?.address,
    watch: true,
    enabled: isMounted,
  });
  const {
    error,
    status,
    isLoading: isLoadingSend,
    sendTransaction,
  } = useSendTransaction();
  const [disabled, setDisabled] = useState(isLoadingSend);

  const [showAlert, setShowAlert] = useState({
    show: false,
    alertType: "",
    alertText: "",
  });

  useEffect(() => setIsMounted(true), []);

  const clearAlert = () => {
    setTimeout(() => {
      setShowAlert({ show: false, alertType: "", alertText: "" });
    }, 3000);
  };

  const handleClick = () => {
    if (
      address &&
      address !== "" &&
      amount &&
      amount !== "0" &&
      utils.parseEther(amount) > 0
    ) {
      setDisabled(true);
      sendTransaction({
        request: { to: address, value: utils.parseEther(amount) },
      });
    } else {
      setShowAlert({
        show: true,
        alertType: "danger",
        alertText: "please enter all values",
      });
      clearAlert();
    }
  };
  useEffect(() => {
    if (status !== "loading") {
      setDisabled(false);
      setAmount("0");
      setAddress("");
    }
  }, [status]);

  const handleValue = (e) => {
    try {
      const value = utils.parseEther(e.currentTarget.value);
      if (value >= 0) {
        setAmount(e.currentTarget.value);
      }
    } catch (error) {
      setAmount("");
    }
  };
  if (!isMounted) return <div>not mounted</div>;
  return (
    <>
      {activeChain && account ? (
        <Box component="form" noValidate autoComplete="off" className="form">
          {showAlert.show && <Alert {...showAlert} />}
          <Typography>Send ETH</Typography>
          <Typography>
            Your balance: {formatBalance(balance?.value)} {balance?.symbol}
          </Typography>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <TextField
                helperText="Please enter a value in ETH"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                variant="standard"
                type="text"
                required
                margin="normal"
                label="Amount"
                value={amount}
                onChange={handleValue}
                disabled={disabled}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                helperText="Please enter a valid ETH address"
                variant="standard"
                type="text"
                required
                margin="normal"
                label="To (Address)"
                value={address}
                onChange={(e) => setAddress(e.currentTarget.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleClick}
                disabled={disabled}
              >
                Send
              </Button>
            </Grid>
          </Grid>
          <Typography color={isError ? "red" : "text.primary"}>
            Transaction status : {status}
          </Typography>
          {isError && (
            <Typography color="red">{error?.data?.message}</Typography>
          )}
        </Box>
      ) : (
        <Typography>function not supported</Typography>
      )}
    </>
  );
};

export default SendEthForm;
