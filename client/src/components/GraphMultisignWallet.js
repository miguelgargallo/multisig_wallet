import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useQuery, gql } from "@apollo/client";
import { utils } from "ethers";
import { shortenAddress } from "../utils/utils";

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.REACT_APP_GRAPH_URL,
});

const QUERY = gql`
  {
    confirmTransactions(first: 5) {
      id
      owner
      txIndex
    }
    deposits(first: 5) {
      id
      sender
      amount
      balance
    }
  }
`;

const GraphMultisignWallet = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ShowGraphMultisignWallet />
    </ApolloProvider>
  );
};

const ShowGraphMultisignWallet = () => {
  const { loading, error, data } = useQuery(QUERY, {
    pollInterval: 500,
  });

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <Container maxWidth="sm" fontSize="small">
        Error {error.message}
      </Container>
    );

  return (
    <Paper elevation={4}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        padding={1}
        spacing={0}
      >
        <Typography>
          MultisignWallet contract events queried from The Graph
        </Typography>
        <TableContainer>
          <Table size="small" aria-label="confirmTransactions">
            <TableHead>
              <TableRow>
                <TableCell align="left">Tx</TableCell>
                <TableCell align="left">Owner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.confirmTransactions.map(({ id, owner, txIndex }) => {
                return (
                  <TableRow key={id}>
                    <TableCell align="left">{txIndex}</TableCell>
                    <TableCell align="left">{shortenAddress(owner)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer>
          <Table size="small" aria-label="confirmTransactions">
            <TableHead>
              <TableRow>
                <TableCell align="left">Sender</TableCell>
                <TableCell align="left">Amount</TableCell>
                <TableCell align="left">Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.deposits.map(({ id, sender, amount, balance }) => {
                return (
                  <TableRow key={id}>
                    <TableCell align="left">{shortenAddress(sender)}</TableCell>
                    <TableCell align="left">
                      {utils.formatUnits(amount, "gwei")} gwei
                    </TableCell>
                    <TableCell align="left">
                      {utils.formatUnits(balance, "gwei")} gwei
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
};

export default GraphMultisignWallet;
