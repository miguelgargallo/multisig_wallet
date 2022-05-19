import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

import { BigNumber, utils } from "ethers";
import { useContractWrite } from "wagmi";
import { useIsMounted } from "../hooks";

import { GetContract, GetStatusIcon } from "../components";
import { addressNotZero } from "../utils/utils";
import { ShowError } from ".";

const SubmitTransaction = ({
  activeChain,
  contractAddress,
  contractABI,
  account,
}) => {
  const isMounted = useIsMounted();

  const { contractAddress: contractAddressTest, contractABI: contractABITest } =
    GetContract("TestContract");
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
        activeChain && account && addressNotZero(contractAddress)
      ),
    }
  );

  const handleValue = (e) => {
    try {
      const localvalue = utils.parseEther(e.currentTarget.value);
      if (localvalue >= 0) {
        setValue(e.currentTarget.value);
      }
    } catch (error) {}
  };
  const handleClick = () => {
    if (callData && callData !== "") {
      setDisabled(true);
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

      writeSubmit({
        args: [
          contractAddressTest,
          BigNumber.from(utils.parseUnits(defaultValue, "gwei")),
          data,
        ],
      });
      setDisabled(false);
      setValue("0");
      setParam1("0");
      setParam2("0");
      setParamAbc("");
      //setCallData("1");
    }
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

  useEffect(() => {
    if (statusSubmit !== "loading") {
      if (disabled) setDisabled(false);
    }
    // eslint-disable-next-line
  }, [statusSubmit]);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      padding={1}
    >
      {isMounted && (
        <>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
            padding={1}
          >
            <Typography>Submit a transaction</Typography>

            <TextField
              value={callData}
              onChange={(e) => setCallData(e.target.value)}
              disabled={disabled}
              select
            >
              {callDataValues.map((fnCall) => (
                <MenuItem key={fnCall.value} value={fnCall.value}>
                  {fnCall.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              variant="standard"
              type="text"
              margin="normal"
              label="Value (in gwei)"
              value={value}
              onChange={handleValue}
              disabled={disabled}
            />
            {callData === "1" ? (
              <>
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
                />
              </>
            )}
          </Stack>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            padding={1}
          >
            <Button
              variant="contained"
              onClick={handleClick}
              disabled={
                disabled ||
                isLoadingSubmit ||
                (callData === "2" && !paramAbc) ||
                (callData === "1" && (!param1 || !param2))
              }
              endIcon={<GetStatusIcon status={statusSubmit} />}
            >
              Submit
            </Button>
            {isErrorSubmit && (
              <ShowError flag={isErrorSubmit} error={errorSubmit} />
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default SubmitTransaction;
