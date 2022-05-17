import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { useQuery, gql } from "@apollo/client";
import { utils } from "ethers";

const QUERY = gql`
  {
    approvals(first: 5) {
      id
      owner
      spender
      value
    }
    ownershipTransferreds(first: 5) {
      id
      previousOwner
      newOwner
    }
  }
`;

const GraphMyToken = () => {
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
    <Container maxWidth="sm" fontSize="small">
      <Typography>MyToken contract events queried from The Graph</Typography>
      <ul>
        {data.approvals.map(({ id, owner, spender, value }) => {
          return (
            <li key={id}>
              <Typography>
                Owner:{owner} Spender:{spender} Value:{" "}
                {utils.formatEther(value)}
              </Typography>
            </li>
          );
        })}
      </ul>
      <ul>
        {data.ownershipTransferreds.map(({ id, previousOwner, newOwner }) => {
          return (
            <li key={id}>
              <Typography>
                Previous Owner: {previousOwner} New Owner: {newOwner}
              </Typography>
            </li>
          );
        })}
      </ul>
    </Container>
  );
};

export default GraphMyToken;
