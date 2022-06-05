import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

import { BigNumber, utils } from "ethers";
import { useIsMounted, useGetContract, useGetFuncWrite } from "../hooks";

import { GetStatusIcon, ShowError } from "../components";
import { addressNotZero } from "../utils/utils";

const SubmitTransaction = ({
  activeChain,
  contractAddress,
  contractABI,
  account,
}) => {
  const isMounted = useIsMounted();
  const isEnabled = Boolean(
    isMounted && activeChain && account && addressNotZero(contractAddress)
  );
  const { address: contractAddressTest, ABI: contractABITest } =
    useGetContract("TestContract");
  const ifaceContractTest = new utils.Interface(contractABITest);

  const [disabled, setDisabled] = useState(false);
  const [callData, setCallData] = useState("1");
  const [input, setInput] = useState({
    param1: "0",
    param2: "0",
    paramAbc: "",
    value: "0",
  });
  const [isErrorInput, setIsErrorInput] = useState({
    param1: false,
    param2: false,
    paramAbc: false,
    value: false,
  });

  const callDataValues = [
    {
      value: "1",
      label: "TestContract.callMe(uint256 j, uint256 a)",
    },
    {
      value: "2",
      label: "TestContract.callMeString(string abc)",
    },
  ];

  // submit function
  const {
    error: errorSubmit,
    isError: isErrorSubmit,
    write: writeSubmit,
    status: statusSubmit,
    statusWait: statusSubmitWait,
  } = useGetFuncWrite(
    "submitTransaction",
    activeChain,
    contractAddress,
    contractABI,
    isEnabled
  );

  const handleSubmit = () => {
    if (callData && callData !== "") {
      let localValue = 0;
      let data;
      if (input.value && input.value !== "" && parseFloat(input.value) >= 0) {
        localValue = BigNumber.from(utils.parseUnits(input.value, "gwei"));
        if (callData === "1") {
          if (
            input.param1 &&
            input.param1 !== "" &&
            parseFloat(input.param1) >= 0
          ) {
            if (
              input.param2 &&
              input.param2 !== "" &&
              parseFloat(input.param2) >= 0
            ) {
              data = ifaceContractTest.encodeFunctionData("callMe", [
                BigNumber.from(input.param1),
                BigNumber.from(input.param2),
              ]);
              setDisabled(true);
              writeSubmit({
                args: [contractAddressTest, localValue, data],
              });
            } else {
              setIsErrorInput({ ...isErrorInput, param2: true });
            }
          } else {
            setIsErrorInput({ ...isErrorInput, param1: true });
          }
        } else if (callData === "2") {
          if (input.paramAbc && input.paramAbc !== "") {
            data = ifaceContractTest.encodeFunctionData("callMeString", [
              input.paramAbc,
            ]);
            setDisabled(true);
            writeSubmit({
              args: [contractAddressTest, localValue, data],
            });
          } else {
            setIsErrorInput({ ...isErrorInput, paramAbc: true });
          }
        }
      } else {
        setIsErrorInput({ ...isErrorInput, value: true });
      }
    }
  };
  const handleInputValue = (e) => {
    setInput({ ...input, value: e.target.value });
    if (isErrorInput.value) setIsErrorInput({ ...isErrorInput, value: false });
  };
  const handleInputParam1 = (e) => {
    setInput({ ...input, param1: e.target.value });
    if (isErrorInput.param1)
      setIsErrorInput({ ...isErrorInput, param1: false });
  };
  const handleInputParam2 = (e) => {
    setInput({ ...input, param2: e.target.value });
    if (isErrorInput.param2)
      setIsErrorInput({ ...isErrorInput, param2: false });
  };
  const handleInputParamAbc = (e) => {
    setInput({ ...input, paramAbc: e.target.value });
    if (isErrorInput.paramAbc)
      setIsErrorInput({ ...isErrorInput, paramAbc: false });
  };

  useEffect(() => {
    if (statusSubmit !== "loading" && statusSubmitWait !== "loading") {
      if (disabled) setDisabled(false);
      setInput({
        ...input,
        param1: "0",
        param2: "0",
        paramAbc: "",
        value: "0",
      });
    }
    // eslint-disable-next-line
  }, [statusSubmit, statusSubmitWait]);

  if (!isMounted) return <></>;
  return (
    <Paper elevation={4}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        padding={1}
      >
        <Typography variant="h6" gutterBottom component="div">
          Submit a transaction
        </Typography>

        <TextField
          value={callData}
          onChange={(e) => setCallData(e.target.value)}
          disabled={disabled}
          select
          size="small"
        >
          {callDataValues.map((fnCall) => (
            <MenuItem key={fnCall.value} value={fnCall.value}>
              {fnCall.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          error={isErrorInput.value}
          variant="standard"
          type="number"
          margin="normal"
          label="Value (in gwei)"
          value={input.value}
          onChange={handleInputValue}
          disabled={disabled}
          size="small"
        />
        {callData === "1" ? (
          <>
            <TextField
              error={isErrorInput.param1}
              variant="standard"
              type="number"
              required
              margin="normal"
              label="Parameter 1"
              value={input.param1}
              onChange={handleInputParam1}
              disabled={disabled}
              size="small"
            />
            <TextField
              error={isErrorInput.param2}
              variant="standard"
              type="number"
              required
              margin="normal"
              label="Parameter 2"
              value={input.param2}
              onChange={handleInputParam2}
              disabled={disabled}
              size="small"
            />
          </>
        ) : (
          <>
            <TextField
              error={isErrorInput.paramAbc}
              fullWidth
              value={input.paramAbc}
              required
              variant="standard"
              margin="normal"
              label="Parameter abc"
              onChange={handleInputParamAbc}
              disabled={disabled}
              size="small"
            />
          </>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={disabled}
          size="small"
          startIcon={<GetStatusIcon status={statusSubmit} />}
          endIcon={<GetStatusIcon status={statusSubmitWait} />}
        >
          Submit
        </Button>
        {isErrorSubmit && (
          <ShowError flag={isErrorSubmit} error={errorSubmit} />
        )}
      </Stack>
    </Paper>
  );
};

export default SubmitTransaction;
