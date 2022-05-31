import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import {
  useIsMounted,
  useGetTransactionsCount,
  useGetConfReq,
  useGetContract,
} from "../hooks";

import { utils } from "ethers";
import { GetOneTransaction } from "../components";
import { getNumConfirmations } from "../utils/utils";

const GetTransactions = ({ activeChain, contractAddress, contractABI }) => {
  const isMounted = useIsMounted();
  const txConfirmations = getNumConfirmations(activeChain);
  const { ABI: contractABITest } = useGetContract("TestContract");
  const ifaceContractTest = new utils.Interface(contractABITest);

  const transactionsCount = useGetTransactionsCount(
    activeChain,
    contractAddress,
    contractABI
  );
  const numConfirmationsRequired = useGetConfReq(
    activeChain,
    contractAddress,
    contractABI
  );

  const TransactionsArray = [
    ...Array.from(
      { length: parseInt(transactionsCount) },
      (_, idx) => `${++idx}`
    ),
  ];

  if (!isMounted) return <></>;
  return (
    <Paper elevation={4}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        padding={1}
        spacing={1}
      >
        <TableContainer>
          <Table size="small" aria-label="transactions">
            <TableHead>
              <TableRow>
                <TableCell align="center">Tx</TableCell>
                <TableCell align="center">Data</TableCell>
                <TableCell align="center">Exec?</TableCell>
                <TableCell align="center">Confirm?</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TransactionsArray.map((_, index) => {
                return (
                  <GetOneTransaction
                    key={index}
                    txIdx={index}
                    iface={ifaceContractTest}
                    activeChain={activeChain}
                    contractAddress={contractAddress}
                    contractABI={contractABI}
                    numConfirmationsRequired={numConfirmationsRequired}
                    txConfirmations={txConfirmations}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
};
export default GetTransactions;
