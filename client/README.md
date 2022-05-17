# These are the fullstack Ethereum React Applications, using the demo contract (Greeter) and a ERC20 token, demonstrating several operations:

- changing a state contract variable and calling contract functions using usedapp hooks (GetGreeterForm, SetGreeterForm)
- sending ether
- querying transactions using usedapp hooks
- querying notifications
- querying subgraph deployed to The Graph Studio if the contract is deployed on Rinkeby
- performing standard operations on a mintable,burnable,ownable ERC20 contract : minting, burning, approving, transferring ownership,changing allowances.

## Live client application

The client application for the Greeter contract is deployed on Netlify/Rinkeby.
https://complete-boilerplate.netlify.app/

The client application for the ERC20 contract is deployed on Netlify/Rinkeby.
https://mytokenoperations.netlify.app/

## Quickstart

### `npm install`

To install the required packages.

Configure .env file in the client folder
An example of .env file :

```bash .env
GENERATE_SOURCEMAP=false
REACT_APP_RINKEBY_URL="https://eth-rinkeby.alchemyapi.io/v2/your-api-key"
REACT_APP_KOVAN_URL="https://eth-kovan.alchemyapi.io/v2/your-api-key"
REACT_APP_GRAPH_URL="https://api.studio.thegraph.com/query/24949/greetergraph/0.0.4"
or
REACT_APP_GRAPH_URL="https://api.studio.thegraph.com/query/24949/mytoken/0.0.3"
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Subgraph Greeter deployed on The Graph studio

In the client/src folder there is a `greetergraph` folder containing the deployement
of the Greeter contract on the Rinkeby network.

## Subgraph MyToken deployed on The Graph studio

In the client/src folder there is a `graphmytoken` folder containing the deployement
of the ERC20 contract on the Rinkeby network.
