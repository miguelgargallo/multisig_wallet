import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useIsMounted, useGetTransactionsCount, useGetConfReq } from "../hooks";

import { utils } from "ethers";
import { GetContractTestContract, GetTransaction } from "../components";

const GetTransactions = ({ activeChain, contractAddress, contractABI }) => {
  const isMounted = useIsMounted();

  const { contractAddress: _, contractABI: contractABITest } =
    GetContractTestContract("TestContract");
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
    <>
      {isMounted && (
        <>
          <Typography>Transactions</Typography>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="transactions">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Tx</TableCell>
                  <TableCell align="left">To(Contract)</TableCell>
                  <TableCell align="left">Data</TableCell>
                  <TableCell align="left">Executed</TableCell>
                  <TableCell align="left">Confirmations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {TransactionsArray.map((_, index) => {
                  return (
                    <GetTransaction
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
    </>
  );
};
export default GetTransactions;
