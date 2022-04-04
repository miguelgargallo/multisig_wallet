from brownie import Wei, accounts, MultiSigWallet, TestContract
from scripts.deploy import params_msw, deploy_contracts, fund_contract, create_and_confirm_tx, execute_tx, print_values
from web3 import Web3
import pytest
import random


@pytest.fixture
def deploy_contracts_fixture():
    # arrange/act
    multiSigWallet, testContract = deploy_contracts(accounts[0])
    # assert
    assert multiSigWallet is not None and testContract is not None
    return multiSigWallet, testContract


def test_fund_contract(deploy_contracts_fixture):
    # arrange
    multiSigWallet, testContract = deploy_contracts_fixture
    # act
    howMuch = "1 gwei"
    who_funds = accounts[0]
    fund_contract(multiSigWallet, howMuch, who_funds)
    # assert
    assert multiSigWallet.balance() == Wei(howMuch)


def test_create_tx(deploy_contracts_fixture):
    # arrange
    multiSigWallet, testContract = deploy_contracts_fixture
    # act
    transaction_value = Web3.toWei(1, "gwei")
    param1 = random.randint(0, 1000)
    param2 = random.randint(0, 2000)
    calldata_encoded = testContract.callMe.encode_input(param1, param2)
    tx = multiSigWallet.submitTransaction(
        testContract.address, transaction_value, calldata_encoded, {"from": accounts[0]})
    tx.wait(1)
    # assert
    assert multiSigWallet.getTransactionCount() == 1


def test_confirm_revoke_tx(deploy_contracts_fixture):
    # arrange
    multiSigWallet, testContract = deploy_contracts_fixture
    # act
    transaction_value = Web3.toWei(1, "gwei")
    param1 = random.randint(0, 1000)
    param2 = random.randint(0, 2000)
    calldata_encoded = testContract.callMe.encode_input(param1, param2)
    tx = multiSigWallet.submitTransaction(
        testContract.address, transaction_value, calldata_encoded, {"from": accounts[0]})
    tx.wait(1)
    tx_index = tx.return_value

    tx_confirm = multiSigWallet.confirmTransaction(
        tx_index, {"from": accounts[0]})
    tx_confirm.wait(1)
    # assert
    assert multiSigWallet.isConfirmed(tx_index, accounts[0].address) == True
    assert multiSigWallet.isConfirmed(tx_index, accounts[1].address) == False
    assert multiSigWallet.isConfirmed(tx_index, accounts[2].address) == False
    tx_revoke = multiSigWallet.revokeConfirmation(
        tx_index, {"from": accounts[0]})
    tx_revoke.wait(1)
    assert multiSigWallet.isConfirmed(tx_index, accounts[0].address) == False
    assert multiSigWallet.isConfirmed(tx_index, accounts[1].address) == False
    assert multiSigWallet.isConfirmed(tx_index, accounts[2].address) == False


def test_execute_tx(deploy_contracts_fixture):
    # arrange
    multiSigWallet, testContract = deploy_contracts_fixture
    howMuch = "1 gwei"
    who_funds = accounts[0]
    fund_contract(multiSigWallet, howMuch, who_funds)

    transaction_value = Web3.toWei(1, "gwei")
    param1 = random.randint(0, 1000)
    param2 = random.randint(0, 2000)
    calldata_encoded = testContract.callMe.encode_input(param1, param2)
    tx = multiSigWallet.submitTransaction(
        testContract.address, transaction_value, calldata_encoded, {"from": accounts[0]})
    tx.wait(1)
    tx_index = tx.return_value
    owners, numConfirm = params_msw()
    for i in range(0, numConfirm):
        tx_confirm = multiSigWallet.confirmTransaction(0, {"from": owners[i]})
        tx_confirm.wait(1)

    # act
    tx = multiSigWallet.executeTransaction(tx_index, {"from": accounts[0]})
    tx.wait(1)

    # assert
    executed = False
    _address, _value, _data, executed, _numConf = multiSigWallet.getTransaction(
        tx_index)
    assert executed == True
