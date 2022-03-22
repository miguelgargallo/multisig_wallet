Study case of MultiSigWallet contract, from Solidity by example site [Solidity by Example, Multi-Sig Wallet](https://solidity-by-example.org/app/multi-sig-wallet/)

I used brownie with hardhat in order to deploy and use the console.log features.
You should start the hardhat node in another terminal and folder (`hh node`), then, in a terminal :

```
brownie compile
brownie run scripts/deploy.py
```

The code is filled with console.log calls in order to see the different calls and the execution of functions.

The MultiSigWallet is allowing to encode a transaction against another contract, to confirm it using multisignatures from his owners and to submit and execute this transaction on the other contract using low-level call.

In the deploy.py script, a transaction with a call to the TestContract.callMe is encoded and executed.

For obtaining the signature of the solidity function call, we use Web3.keccak function.
For parameters encoding, encode_abi function from python's eth_abi package.
The signature together with the parameters encoded are submitted to the solidity call function as payload:

```solidity
(bool success, bytes memory returnData) = address(contract).call(payload);
require(success);
```

Here is the relevant Python code (using brownie):

```python
    func_signature = Web3.keccak(text="callMe(uint256,uint256)")[:4].hex()
    var1 = tr_value
    var2 = 10000
    params_encoded = eth_abi.encode_abi(
        ["uint256", "uint256"], [var1, var2]).hex()
    calldata_encoded = func_signature+params_encoded
    print(calldata_encoded)
    solidity_encoded = t.getData(var1, var2)
    print(solidity_encoded)
    assert solidity_encoded == calldata_encoded

    # in the case we want to test the encoding of string, equivalent of
    # solidity code
    #     bytes memory payload = abi.encodeWithSignature("callMeString(string)", var1);
    # end of solidity code
    # func_signature = Web3.keccak(text="callMeString(string)")[:4].hex()
    # var1 = "test"
    # params_encoded = eth_abi.encode_abi(["string"], [var1]).hex()
    # calldata_encoded = func_signature+params_encoded
    # print(calldata_encoded)
    # solidity_encoded = t.getDataString(var1)
    # print(solidity_encoded)
    # assert solidity_encoded == calldata_encoded

    tx = msw.submitTransaction(
        t.address, tr_1_ether, calldata_encoded, {"from": accounts[0]})
    tx.wait(1)
```

Deployment from brownie, screenshot of console at the end:
![Multi-Sig Wallet deployment ](multisig_wallet_deploy.png)

From the hardhat console, the console.log output:
![Hardhat console](multisig_wallet_console.png)
