Study cases of MultiSigWallet contract, from Solidity by example site [Solidity by Example, Multi-Sig Wallet](https://solidity-by-example.org/app/multi-sig-wallet/)

I used brownie with hardhat in order to deploy and use the console.log features.
You should start the hardhat node in another terminal and folder (`hh node`), then, in a terminal :

```
brownie compile
brownie run scripts/deploy.py
```

The code is filled with console.log calls in order to see the different calls and the execution of functions.
Attention, in the example site, the TestContract.callMe() function is not declared payable, thus the low-level call in MultiSigWallet.executeTransaction will fail because it tries to send ether using transaction.value parameter.

Deployment from brownie, screenshot of console at the end:
![Multi-Sig Wallet deployment ](multisig_wallet_deploy.png)

From the hardhat console, the console.log output:
![Hardhat console](multisig_wallet_console.png)
