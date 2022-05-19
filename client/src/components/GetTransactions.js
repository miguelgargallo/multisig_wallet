import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import { useIsMounted, useGetTransactionsCount, useGetConfReq } from "../hooks";

import { utils } from "ethers";
import { GetOneTransaction, GetContract } from "../components";

const GetTransactions = ({ activeChain, contractAddress, contractABI }) => {
  const isMounted = useIsMounted();

  const { contractABI: contractABITest } = GetContract("TestContract");
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

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      padding={1}
      spacing={1}
    >
      {isMounted && (
        <>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="transactions">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Tx</TableCell>
                  {/* <TableCell align="left">To(Contract)</TableCell> */}
                  <TableCell align="left">Data</TableCell>
                  <TableCell align="left">Executed</TableCell>
                  <TableCell align="left">Confirmations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {TransactionsArray.map((_, index) => {
                  return (
                    <GetOneTransaction
                      key={index}
                      txIdx={index}
                      numConfirmationsRequired={numConfirmationsRequired}
                      iface={ifaceContractTest}
                      activeChain={activeChain}
                      contractAddress={contractAddress}
                      contractABI={contractABI}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Stack>
  );
};
export default GetTransactions;
