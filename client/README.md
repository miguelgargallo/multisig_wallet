# Client Application for the Multisignature contract

It allow users to submit,confirm and execute transactions agains a TestContract

## Live client application

The client application is deployed on Netlify/Rinkeby.

https://to-be-deployed.netlify.app/

![Multi-Sig Wallet webapp ](../multisigwallet_frontend.png)

## Quickstart

### `npm install`

To install the required packages.

### `configure .env`

Configure .env file in the client folder
An example of .env file :

```bash .env
GENERATE_SOURCEMAP=false
ALCHEMY_ID="your-api-key"
REACT_APP_RINKEBY_URL="https://eth-rinkeby.alchemyapi.io/v2/your-api-key"
REACT_APP_GRAPH_URL="https://api.studio.thegraph.com/query/24949/greetergraph/0.0.4"
```

### `start the application`

```bash
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

You can switch the networks between hardhat and rinkeby.

## Subgraph Greeter deployed on The Graph studio

In the client/src folder there is a `greetergraph` folder containing the deployement
of the Greeter contract on the Rinkeby network.
