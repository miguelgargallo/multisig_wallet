import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useQuery, gql } from "@apollo/client";

const GREETER_QUERY = gql`
  {
    newGreetings(sort: { field: id, order: DESC }) {
      id
      sender
      newGreeting
    }
  }
`;

const GraphGreetings = () => {
  const { loading, error, data } = useQuery(GREETER_QUERY, {
    pollInterval: 500,
  });

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <Box className="form" overflow="auto" height="20rem" fontSize="small">
        Error {error.message}
      </Box>
    );

  return (
    <Box className="form" overflow="auto" height="20rem" fontSize="small">
      <Typography>Greeter contract events queried from The Graph</Typography>
      <ul>
        {data.newGreetings.map(({ id, sender, newGreeting }) => {
          return (
            <li key={id}>
              <Typography>
                {sender}: {newGreeting}
              </Typography>
            </li>
          );
        })}
      </ul>
    </Box>
  );
};

export default GraphGreetings;
