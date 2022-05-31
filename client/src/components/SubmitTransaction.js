import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

import { BigNumber, utils } from "ethers";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useIsMounted, useGetContract } from "../hooks";

import { GetStatusIcon } from "../components";
import { addressNotZero, getNumConfirmations } from "../utils/utils";
import { ShowError } from ".";

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
  const numConfirmations = getNumConfirmations(activeChain);
  const { address: contractAddressTest, ABI: contractABITest } =
    useGetContract("TestContract");
  const ifaceContractTest = new utils.Interface(contractABITest);

  const [disabled, setDisabled] = useState(false);
  const [callData, setCallData] = useState("1");
  const [param1, setParam1] = useState("0");
  const [param2, setParam2] = useState("0");
  const [paramAbc, setParamAbc] = useState("");
  const [value, setValue] = useState("0");

  const callDataValues = [
    {
      value: "1",
      label: "TestContract.callMe(uint256 j, uint256 a)",
    },
    {
      value: "2",
      label: "TestContract.callMeString(string _abc)",
    },
  ];

  const {
    data: dataSubmit,
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
      enabled: isEnabled,
    }
  );
  const { status: statusSubmitWait } = useWaitForTransaction({
    hash: dataSubmit?.hash,
    wait: dataSubmit?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  const handleValue = (e) => {
    try {
      const localvalue = utils.parseEther(e.currentTarget.value);
      if (localvalue >= 0) {
        setValue(e.currentTarget.value);
      }
    } catch (error) {}
  };
  const handleSubmit = () => {
    if (callData && callData !== "") {
      let defaultValue = 0;
      if (value || parseFloat(value) >= 0) defaultValue = value;
      let data;
      if (callData === "1") {
        data = ifaceContractTest.encodeFunctionData("callMe", [
          BigNumber.from(param1),
          BigNumber.from(param2),
        ]);
      } else if (callData === "2") {
        data = ifaceContractTest.encodeFunctionData("callMeString", [paramAbc]);
      }
      setDisabled(true);
      writeSubmit({
        args: [
          contractAddressTest,
          BigNumber.from(utils.parseUnits(defaultValue, "gwei")),
          data,
        ],
      });
    }
  };

  const handleParam1 = (e) => {
    try {
      const value = utils.parseEther(e.target.value);
      if (value >= 0) {
        setParam1(e.currentTarget.value);
      }
    } catch (error) {
      setParam1("");
    }
  };
  const handleParam2 = (e) => {
    try {
      const value = utils.parseEther(e.target.value);
      if (value >= 0) {
        setParam2(e.currentTarget.value);
      }
    } catch (error) {
      setParam2("");
    }
  };

  useEffect(() => {
    if (statusSubmit !== "loading" && statusSubmitWait !== "loading") {
      if (disabled) setDisabled(false);
      setValue("0");
      setParam1("0");
      setParam2("0");
      setParamAbc("");
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
          variant="standard"
          type="number"
          margin="normal"
          label="Value (in gwei)"
          value={value}
          onChange={handleValue}
          disabled={disabled}
          size="small"
        />
        {callData === "1" ? (
          <>
            <TextField
              variant="standard"
              type="number"
              required
              margin="normal"
              label="Parameter 1"
              value={param1}
              onChange={handleParam1}
              disabled={disabled}
              size="small"
            />
            <TextField
              variant="standard"
              type="number"
              required
              margin="normal"
              label="Parameter 2"
              value={param2}
              onChange={handleParam2}
              disabled={disabled}
              size="small"
            />
          </>
        ) : (
          <>
            <TextField
              fullWidth
              value={paramAbc}
              required
              variant="standard"
              margin="normal"
              label="Parameter _abc (string)"
              onChange={(e) => setParamAbc(e.target.value)}
              disabled={disabled}
              size="small"
            />
          </>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            disabled ||
            isLoadingSubmit ||
            (callData === "2" && !paramAbc) ||
            (callData === "1" && (!param1 || !param2))
          }
          size="small"
          endIcon={<GetStatusIcon status={statusSubmit} />}
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
