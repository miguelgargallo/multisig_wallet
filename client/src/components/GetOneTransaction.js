import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { BigNumber, utils } from "ethers";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { addressNotZero } from "../utils/utils";
import { useIsMounted } from "../hooks";
import { ShowError } from ".";
import { GetStatusIcon } from "../components";

const GetOneTransaction = ({
  txIdx,
  numConfirmationsRequired,
  iface,
  activeChain,
  contractAddress,
  contractABI,
}) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);

  const {
    data: tx,
    isLoading: isLoadingTx,
    isError: isErrorTx,
    isSuccess: isSuccessTx,
    error: errorTx,
    status: statusTx,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "getTransaction",
    {
      args: [BigNumber.from(txIdx)],
      watch: true,
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  const {
    error: errorConfirm,
    isError: isErrorConfirm,
    isLoading: isLoadingConfirm,
    write: writeConfirm,
    status: statusConfirm,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "confirmTransaction",
    {
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  const {
    error: errorRevoke,
    isError: isErrorRevoke,
    isLoading: isLoadingRevoke,
    write: writeRevoke,
    status: statusRevoke,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "revokeConfirmation",
    {
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  const {
    error: errorExecute,
    isError: isErrorExecute,
    isLoading: isLoadingExecute,
    write: writeExecute,
    status: statusExecute,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "executeTransaction",
    {
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  const handleConfirm = (e) => {
    e.preventDefault();
    setDisabled(true);
    writeConfirm({ args: [BigNumber.from(e.currentTarget.value)] });
  };

  const handleRevoke = (e) => {
    e.preventDefault();
    setDisabled(true);
    writeRevoke({ args: [BigNumber.from(e.currentTarget.value)] });
  };

  const handleExecute = (e) => {
    e.preventDefault();
    setDisabled(true);
    writeExecute({ args: [BigNumber.from(e.currentTarget.value)] });
  };

  useEffect(() => {
    if (statusTx !== "loading") {
      if (disabled) setDisabled(false);
    }
    if (statusConfirm !== "loading") {
      if (disabled) setDisabled(false);
    }
    if (statusRevoke !== "loading") {
      if (disabled) setDisabled(false);
    }
    if (statusExecute !== "loading") {
      if (disabled) setDisabled(false);
    }
    // eslint-disable-next-line
  }, [statusTx, statusConfirm, statusRevoke, statusExecute]);

  if (isLoadingTx)
    return (
      <TableRow key={txIdx}>
        <TableCell align="right">
          Loading Transaction...<GetStatusIcon status="loading"></GetStatusIcon>
        </TableCell>
      </TableRow>
    );
  //const trTo = tx[0];
  const value = utils.formatUnits(tx[1]?.toString(), "gwei");
  const data = tx[2];
  let param0, param1, paramAbc;
  try {
    paramAbc = iface.decodeFunctionData("callMeString", data)[0];
  } catch (err) {
    try {
      param0 = iface.decodeFunctionData("callMe", data)[0].toString();
      param1 = iface.decodeFunctionData("callMe", data)[1].toString();
    } catch (error) {
      console.log("error=", error);
    }
  }
  const executed = tx[3].toString();
  const txNumConfirmations = tx[4].toString();

  return (
    <>
      {isMounted && (
        <TableRow key={txIdx}>
          {isSuccessTx ? (
            <>
              <TableCell align="right">{txIdx}</TableCell>
              {/* <TableCell align="left">{shortenAddress(trTo)}</TableCell> */}
              <TableCell align="left">
                {paramAbc ? (
                  <>
                    TestContract.callMeString("{paramAbc}"), value: {value} gwei
                  </>
                ) : (
                  <>
                    TestContract.callMe({param0},{param1}), value: {value} gwei
                  </>
                )}
              </TableCell>
              <TableCell align="left">{executed}</TableCell>
              <TableCell align="right">{txNumConfirmations}</TableCell>
              <TableCell align="left">
                {executed !== "true" && (
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={0.5}
                  >
                    {parseInt(txNumConfirmations) <
                      parseInt(numConfirmationsRequired.toString()) && (
                      <Button
                        variant="contained"
                        size="small"
                        disabled={disabled || isLoadingConfirm}
                        value={txIdx}
                        onClick={handleConfirm}
                        endIcon={<GetStatusIcon status={statusConfirm} />}
                      >
                        Confirm?
                      </Button>
                    )}
                    {parseInt(txNumConfirmations) > 0 && (
                      <Button
                        variant="contained"
                        size="small"
                        disabled={disabled || isLoadingRevoke}
                        value={txIdx}
                        onClick={handleRevoke}
                        endIcon={<GetStatusIcon status={statusRevoke} />}
                      >
                        Revoke?
                      </Button>
                    )}
                    {txNumConfirmations ===
                      numConfirmationsRequired.toString() && (
                      <Button
                        variant="contained"
                        size="small"
                        disabled={disabled || isLoadingExecute}
                        value={txIdx}
                        onClick={handleExecute}
                        endIcon={<GetStatusIcon status={statusExecute} />}
                      >
                        Execute?
                      </Button>
                    )}
                  </Stack>
                )}
              </TableCell>
              <TableCell align="right">
                {isErrorConfirm && (
                  <ShowError flag={isErrorConfirm} error={errorConfirm} />
                )}
                {isErrorRevoke && (
                  <ShowError flag={isErrorRevoke} error={errorRevoke} />
                )}
                {isErrorExecute && (
                  <ShowError flag={isErrorExecute} error={errorExecute} />
                )}
              </TableCell>
            </>
          ) : (
            <>
              <TableCell align="right"></TableCell>
              {/* <TableCell align="left"></TableCell> */}
              <TableCell align="left">
                <ShowError flag={isErrorTx} error={errorTx} />
              </TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
            </>
          )}
        </TableRow>
      )}
    </>
  );
};

export default GetOneTransaction;
