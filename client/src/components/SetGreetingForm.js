import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { constants } from "ethers";
import { Alert } from "../components";

import { useNetwork, useContractRead, useContractWrite } from "wagmi";

import contractJson from "../chain-info/Greeter.json";
import networkMapping from "../chain-info/map.json";

const GetContract = (contractName) => {
  const { activeChain } = useNetwork();
  let contractAddress;

  if (!networkMapping[String(activeChain?.id)]) {
    contractAddress = constants.AddressZero;
  } else {
    contractAddress = activeChain?.id
      ? networkMapping[String(activeChain?.id)][contractName][0]
      : constants.AddressZero;
  }

  const { abi: contractABI } = contractJson;
  return { contractAddress, contractABI };
};

export const GetGreetingForm = () => {
  const { contractAddress, contractABI } = GetContract("Greeter");
  const { data, isError, isLoading } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "greet",
    {
      watch: true,
      enabled: Boolean(contractAddress !== constants.AddressZero),
    }
  );

  return (
    <>
      {contractAddress !== constants.AddressZero && !isLoading ? (
        <Box className="form">
          {!isError && data && (
            <Typography>Current greeting : {data}</Typography>
          )}
        </Box>
      ) : (
        <Typography>contract Greeter is not deployed</Typography>
      )}
    </>
  );
};

export const SetGreetingForm = () => {
  const { contractAddress, contractABI } = GetContract("Greeter");

  const { isError, isLoading, write, status, error } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "setGreeting"
  );
  const [newGreeting, setNewGreeting] = useState("");
  const [disabled, setDisabled] = useState(isLoading);

  const [showAlert, setShowAlert] = useState({
    show: false,
    alertType: "",
    alertText: "",
  });

  const clearAlert = () => {
    setTimeout(() => {
      setShowAlert({ show: false, alertType: "", alertText: "" });
    }, 3000);
  };

  useEffect(() => {
    if (status !== "loading") {
      setDisabled(false);
      setNewGreeting("");
    }
  }, [status]);

  const onClick = () => {
    if (newGreeting && newGreeting !== "") {
      setDisabled(true);
      write({ args: [newGreeting] });
    } else {
      setShowAlert({
        show: true,
        alertType: "danger",
        alertText: "please enter all values",
      });
      clearAlert();
    }
  };

  return (
    <>
      {contractAddress !== constants.AddressZero ? (
        <Box component="form" noValidate autoComplete="off" className="form">
          {showAlert.show && <Alert {...showAlert} />}
          <Typography>Set new Greeting</Typography>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                helperText="Please enter a new cool greeting"
                variant="standard"
                type="text"
                required
                margin="normal"
                label="new greeting"
                name="newGreeting"
                value={newGreeting}
                onChange={(e) => setNewGreeting(e.currentTarget.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={onClick} disabled={disabled}>
                set new greeting
              </Button>
            </Grid>
          </Grid>
          <Typography color={isError ? "red" : "text.primary"}>
            Transaction status : {status}
          </Typography>
          {isError && <Typography color="red">{error.message}</Typography>}
        </Box>
      ) : (
        <Typography>contract Greeter is not deployed</Typography>
      )}
    </>
  );
};
