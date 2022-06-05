import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { BigNumber, utils } from "ethers";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { addressNotZero } from "../utils/utils";
import { useIsMounted, useGetFuncWrite } from "../hooks";
import { ShowError, GetStatusIcon } from "../components";

const GetOneTransaction = ({
  txIdx,
  iface,
  activeChain,
  contractAddress,
  contractABI,
  numConfirmationsRequired,
}) => {
  const isMounted = useIsMounted();
  const isEnabled = Boolean(
    isMounted && activeChain && addressNotZero(contractAddress)
  );
  const [disabled, setDisabled] = useState(false);

  const {
    data: tx,
    isLoading: isLoadingTx,
    isError: isErrorTx,
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
      watch: isEnabled,
      enabled: isEnabled,
    }
  );

  // confirmTransaction function
  const {
    error: errorConfirm,
    isError: isErrorConfirm,
    write: writeConfirm,
    status: statusConfirm,
    statusWait: statusConfirmWait,
  } = useGetFuncWrite(
    "confirmTransaction",
    activeChain,
    contractAddress,
    contractABI,
    isEnabled
  );

  // revokeConfirmation function
  const {
    error: errorRevoke,
    isError: isErrorRevoke,
    write: writeRevoke,
    status: statusRevoke,
    statusWait: statusRevokeWait,
  } = useGetFuncWrite(
    "revokeConfirmation",
    activeChain,
    contractAddress,
    contractABI,
    isEnabled
  );

  // executeTransaction function
  const {
    error: errorExecute,
    isError: isErrorExecute,
    write: writeExecute,
    status: statusExecute,
    statusWait: statusExecuteWait,
  } = useGetFuncWrite(
    "executeTransaction",
    activeChain,
    contractAddress,
    contractABI,
    isEnabled
  );

  useEffect(() => {
    if (
      statusTx !== "loading" &&
      statusConfirm !== "loading" &&
      statusConfirmWait !== "loading" &&
      statusRevoke !== "loading" &&
      statusRevokeWait !== "loading" &&
      statusExecute !== "loading" &&
      statusExecuteWait !== "loading"
    ) {
      if (disabled) setDisabled(false);
    }
    // eslint-disable-next-line
  }, [
    statusTx,
    statusConfirm,
    statusConfirmWait,
    statusRevoke,
    statusRevokeWait,
    statusExecute,
    statusExecuteWait,
  ]);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (e.target.value && parseInt(e.target.value) >= 0) {
      setDisabled(true);
      writeConfirm({ args: [BigNumber.from(e.target.value)] });
    }
  };

  const handleRevoke = (e) => {
    e.preventDefault();
    if (e.target.value && parseInt(e.target.value) >= 0) {
      setDisabled(true);
      writeRevoke({ args: [BigNumber.from(e.target.value)] });
    }
  };

  const handleExecute = (e) => {
    e.preventDefault();
    if (e.target.value && parseInt(e.target.value) >= 0) {
      setDisabled(true);
      writeExecute({ args: [BigNumber.from(e.target.value)] });
    }
  };

  if (!isMounted || isLoadingTx) return <></>;
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
  const txNumConfirmations = tx[4];
  const txNumConfirmationsFormatted = txNumConfirmations.toString();

  const txNumConfirmationsInt = parseInt(txNumConfirmations.toString());
  const numConfirmationsRequiredInt = parseInt(
    numConfirmationsRequired.toString()
  );

  return (
    <TableRow key={txIdx}>
      <TableCell align="right">{txIdx}</TableCell>
      <TableCell align="left">
        {paramAbc ? (
          <>
            callMeString("{paramAbc}"), {value} gwei
          </>
        ) : (
          <>
            callMe({param0},{param1}), {value} gwei
          </>
        )}
      </TableCell>
      <TableCell align="left">{executed}</TableCell>
      <TableCell align="right">{txNumConfirmationsFormatted}</TableCell>
      <TableCell align="left">
        {executed !== "true" && (
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={0.5}
          >
            {txNumConfirmationsInt < numConfirmationsRequiredInt && (
              <Button
                variant="contained"
                size="small"
                disabled={disabled}
                value={txIdx}
                onClick={handleConfirm}
                startIcon={<GetStatusIcon status={statusConfirm} />}
                endIcon={<GetStatusIcon status={statusConfirmWait} />}
              >
                Confirm?
              </Button>
            )}
            {txNumConfirmationsInt > 0 && (
              <Button
                variant="contained"
                size="small"
                disabled={disabled}
                value={txIdx}
                onClick={handleRevoke}
                startIcon={<GetStatusIcon status={statusRevoke} />}
                endIcon={<GetStatusIcon status={statusRevokeWait} />}
              >
                Revoke?
              </Button>
            )}
            {txNumConfirmationsInt === numConfirmationsRequiredInt && (
              <Button
                variant="contained"
                size="small"
                disabled={disabled}
                value={txIdx}
                onClick={handleExecute}
                startIcon={<GetStatusIcon status={statusExecute} />}
                endIcon={<GetStatusIcon status={statusExecuteWait} />}
              >
                Execute?
              </Button>
            )}
          </Stack>
        )}
      </TableCell>
      {(isErrorTx || isErrorConfirm || isErrorRevoke || isErrorExecute) && (
        <TableCell align="right">
          {isErrorTx && <ShowError flag={isErrorTx} error={errorTx} />}
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
      )}
    </TableRow>
  );
};

export default GetOneTransaction;
