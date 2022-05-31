import { useState, useEffect } from "react";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { BigNumber, utils } from "ethers";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { addressNotZero } from "../utils/utils";
import { useIsMounted } from "../hooks";
import { ShowError, GetStatusIcon } from "../components";

const GetOneTransaction = ({
  txIdx,
  iface,
  activeChain,
  contractAddress,
  contractABI,
  numConfirmationsRequired,
  txConfirmations,
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

  const {
    data: dataConfirm,
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
      enabled: isEnabled,
    }
  );
  const { status: statusConfirmWait } = useWaitForTransaction({
    hash: dataConfirm?.hash,
    wait: dataConfirm?.wait,
    confirmations: txConfirmations,
    enabled: isEnabled,
  });

  const {
    data: dataRevoke,
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
      enabled: isEnabled,
    }
  );
  const { status: statusRevokeWait } = useWaitForTransaction({
    hash: dataRevoke?.hash,
    wait: dataRevoke?.wait,
    confirmations: txConfirmations,
    enabled: isEnabled,
  });

  const {
    data: dataExecute,
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
      enabled: isEnabled,
    }
  );
  const { status: statusExecuteWait } = useWaitForTransaction({
    hash: dataExecute?.hash,
    wait: dataExecute?.wait,
    confirmations: txConfirmations,
    enabled: isEnabled,
  });

  const handleConfirm = (e) => {
    e.preventDefault();
    if (e.target.value && parseInt(e.target.value) >= 0) {
      setDisabled(true);
      writeConfirm({ args: [BigNumber.from(e.target.value)] });
    }
  };

  const handleRevoke = (e) => {
    e.preventDefault();
    setDisabled(true);
    writeRevoke({ args: [BigNumber.from(e.target.value)] });
  };

  const handleExecute = (e) => {
    e.preventDefault();
    setDisabled(true);
    writeExecute({ args: [BigNumber.from(e.target.value)] });
  };

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
                disabled={disabled || isLoadingConfirm}
                value={txIdx}
                onClick={handleConfirm}
                endIcon={<GetStatusIcon status={statusConfirm} />}
              >
                Confirm?
              </Button>
            )}
            {txNumConfirmationsInt > 0 && (
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
            {txNumConfirmationsInt === numConfirmationsRequiredInt && (
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
