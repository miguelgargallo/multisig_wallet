import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import { useNetwork } from "wagmi";
import {
  GetGreetingForm,
  SetGreetingForm,
  SendEthForm,
  GraphGreetings,
  SupportedNetworks,
} from "../components";

const Landing = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const { activeChain } = useNetwork();

  if (!activeChain) return <SupportedNetworks />;

  return (
    <>
      {isMounted && (
        <Grid container direction="row" spacing={2} className="container">
          <Grid item>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <GetGreetingForm />
              </Grid>
              <Grid item>
                <SetGreetingForm />
              </Grid>
              <Grid item>{/* <TransactionsList /> */}</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <SendEthForm />
              </Grid>
              <Grid item>
                <GraphGreetings />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Landing;
