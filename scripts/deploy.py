from brownie import accounts,  MultiSigWallet, TestContract
from web3 import Web3


def main():
    owners = [accounts[0].address, accounts[1].address, accounts[2].address]
    numConfirm = 2
    print("Deploying MultiSigWallet contract...")
    msw = MultiSigWallet.deploy(owners, numConfirm, {"from": accounts[0]})
    print(f"MultiSigWallet contract deployed at {msw}")

    print("Deploying TestContract contract...")
    t = TestContract.deploy({"from": accounts[0]})
    print(f"TestContract deployed at {t}")

    print("Funding MultiSigWallet with 5 ether from a[0]...")
    accounts[0].transfer(msw.address, "5 ether")
    print("Funded")

    print("Funding TestContract with 5 ether from a[0]...")
    accounts[0].transfer(t.address, "5 ether")
    print("Funded")

    print("Create a transaction from a[0]...")
    tr_1_ether = Web3.toWei(1, "ether")
    tx = msw.submitTransaction(
        t.address, tr_1_ether, t.getData(100), {"from": accounts[0]})
    tx.wait(1)

    print("Create a transaction from a[1]...")
    tr_2_ether = Web3.toWei(2, "ether")
    tx = msw.submitTransaction(
        t.address, tr_2_ether, t.getData(2), {"from": accounts[1]})
    tx.wait(1)

    print("Confirming transaction 0 from a[0]...")
    tx = msw.confirmTransaction(0, {"from": accounts[0]})
    tx.wait(1)
    print("Confirmed")

    print("Confirming transaction 0 from a[1]...")
    tx = msw.confirmTransaction(0, {"from": accounts[1]})
    tx.wait(1)
    print("Confirmed")

    print(f"TestContract.i is {t.i()}")

    print("Executing transaction 0 from a[1]...")
    tx = msw.executeTransaction(0, {"from": accounts[1]})
    tx.wait(1)
    print("Executes")

    print(f"Now, TestContract.i is {t.i()}")
    print(f"Now, TestContract.balance is {t.balance()}")
    print(f"Now, MultiSigWallet.balance is {msw.balance()}")
    print(f"Now, accounts[0].balance is {accounts[0].balance()}")
