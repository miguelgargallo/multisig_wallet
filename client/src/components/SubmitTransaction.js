import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useIsMounted } from "../hooks";
import { BigNumber, constants, utils } from "ethers";
import { useContractWrite } from "wagmi";

import { GetContractTestContract } from "../components";
import { addressNotZero } from "../utils/utils";

const SubmitTransaction = ({
  activeChain,
  contractAddress,
  contractABI,
  account,
}) => {
  const isMounted = useIsMounted();
  const { contractAddress: contractAddressTest, contractABI: contractABITest } =
    GetContractTestContract("TestContract");
  const ifaceContractTest = new utils.Interface(contractABITest);

  const [disabled, setDisabled] = useState(false);
  const [address, setAddress] = useState("");
  const [param1, setParam1] = useState("0");
  const [param2, setParam2] = useState("0");
  const [value1, setValue1] = useState("0");
  const testContracts = [
    {
      value: contractAddressTest,
      label: "TestContract.callMe(uint256 j, uint256 a)",
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

  return (
    <>
      {isMounted && (
        <>
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
        </>
      )}
    </>
  );
};

export default SubmitTransaction;
