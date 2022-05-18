import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { BigNumber, constants, utils } from "ethers";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { shortenAddress } from "../utils/utils";

const GetTransaction = ({
  index,
  numConfirmationsRequired,
  iface,
  activeChain,
  contractAddress,
  contractABI,
}) => {
  const [disabled, setDisabled] = useState(false);
  const { data: transaction } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "getTransaction",
    {
      args: [BigNumber.from(index)],
      watch: true,
      enabled: Boolean(
        activeChain && contractAddress !== constants.AddressZero
      ),
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
      enabled: Boolean(
        activeChain && contractAddress !== constants.AddressZero
      ),
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
      enabled: Boolean(
        activeChain && contractAddress !== constants.AddressZero
      ),
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
      enabled: Boolean(
        activeChain && contractAddress !== constants.AddressZero
      ),
    }
  );

  if (!transaction) return null;
  const trTo = transaction[0];
  const value = utils.formatUnits(transaction[1]?.toString(), "gwei");
  const data = transaction[2];
  const executed = transaction[3].toString();
  const numConfirmations = transaction[4].toString();
  let param0;
  let param1;
  try {
    param0 = iface.decodeFunctionData("callMe", data)[0].toString();
    param1 = iface.decodeFunctionData("callMe", data)[1].toString();
  } catch (error) {
    param0 = "1";
    param1 = "2";
  }
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

  return (
    <TableRow key={index}>
      <TableCell align="right">{index}</TableCell>
      <TableCell align="left">{shortenAddress(trTo)}</TableCell>
      <TableCell align="left">
        TestContract.callMe({param0},{param1}), value: {value} gwei
      </TableCell>
      <TableCell align="left">{executed}</TableCell>
      <TableCell align="right">{numConfirmations}</TableCell>
      <TableCell align="left">
        {executed !== "true" && (
          <>
            {parseInt(numConfirmations) < numConfirmationsRequired && (
              <Button
                variant="outlined"
                size="small"
                disabled={disabled}
                value={index}
                onClick={handleConfirm}
              >
                Confirm?
              </Button>
            )}
            {parseInt(numConfirmations) > 0 && (
              <Button
                variant="outlined"
                size="small"
                disabled={disabled}
                value={index}
                onClick={handleRevoke}
              >
                Revoke?
              </Button>
            )}
            {numConfirmations === numConfirmationsRequired.toString() && (
              <Button
                variant="outlined"
                size="small"
                disabled={disabled}
                value={index}
                onClick={handleExecute}
              >
                Execute?
              </Button>
            )}
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default GetTransaction;
