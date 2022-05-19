import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { BigNumber, utils } from "ethers";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { shortenAddress, addressNotZero } from "../utils/utils";
import { useIsMounted } from "../hooks";
import { ShowError } from "./";

const GetTransaction = ({
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

  if (!tx) return null;
  const trTo = tx[0];
  const value = utils.formatUnits(tx[1]?.toString(), "gwei");
  const data = tx[2];
  const param0 = iface.decodeFunctionData("callMe", data)[0].toString();
  const param1 = iface.decodeFunctionData("callMe", data)[1].toString();
  const executed = tx[3].toString();
  const txNumConfirmations = tx[4].toString();

  const handleConfirm = (e) => {
    e.preventDefault();
    writeConfirm({ args: [BigNumber.from(e.currentTarget.value)] });
  };

  const handleRevoke = (e) => {
    e.preventDefault();
    writeRevoke({ args: [BigNumber.from(e.currentTarget.value)] });
  };

  const handleExecute = (e) => {
    e.preventDefault();
    writeExecute({ args: [BigNumber.from(e.currentTarget.value)] });
  };
  if (isLoadingTx) return <div>Loading Transaction...</div>;
  return (
    <>
      {isMounted && (
        <>
          {isSuccessTx ? (
            <TableRow key={txIdx}>
              <TableCell align="right">{txIdx}</TableCell>
              <TableCell align="left">{shortenAddress(trTo)}</TableCell>
              <TableCell align="left">
                TestContract.callMe({param0},{param1}), value: {value} gwei
              </TableCell>
              <TableCell align="left">{executed}</TableCell>
              <TableCell align="right">{numConfirmations}</TableCell>
              <TableCell align="left">
                {executed !== "true" && (
                  <>
                    {parseInt(txNumConfirmations) <
                      parseInt(numConfirmationsRequired.toString()) && (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={disabled}
                        value={txIdx}
                        onClick={handleConfirm}
                      >
                        Confirm?
                      </Button>
                    )}
                    {parseInt(txNumConfirmations) > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={disabled}
                        value={txIdx}
                        onClick={handleRevoke}
                      >
                        Revoke?
                      </Button>
                    )}
                    {txNumConfirmations ===
                      numConfirmationsRequired.toString() && (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={disabled}
                        value={txIdx}
                        onClick={handleExecute}
                      >
                        Execute?
                      </Button>
                    )}
                  </>
                )}
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={txIdx}>
              <TableCell align="right"></TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left">
                <ShowError flag={isErrorTx} error={errorTx} />
              </TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          )}
        </>
      )}
    </>
  );
};

export default GetTransaction;
