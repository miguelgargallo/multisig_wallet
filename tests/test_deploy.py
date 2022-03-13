from brownie import accounts, MultiSigWallet, TestContract
from scripts.deploy import fund_contract
from web3 import Web3
import pytest


def params_msw(num_owners):
    owners = []
    for i in range(0, num_owners):
        owners.append(accounts[i].address)
    numConfirm = len(owners)-1
    return owners, numConfirm


def deploy_msw(numOwners):
    owners, numConfirm = params_msw(numOwners)
    msw = MultiSigWallet.deploy(owners, numConfirm, {"from": accounts[0]})
    return msw


def deploy_t():
    t = TestContract.deploy({"from": accounts[0]})
    return t


def test_deploy_msw():
    # arrange/act
    msw = deploy_msw(3)
    # assert
    assert msw is not None


def test_deploy_t():
    # arrange/act
    t = deploy_t()
    # assert
    assert t is not None


def test_fund_contract():
    # arrange
    msw = deploy_msw(3)
    # act
    fund_contract()
    # assert
    assert msw.balance() == Web3.toWei(5, "ether")


def test_create_tx():
    # arrange
    msw = deploy_msw(3)
    t = deploy_t()
    # act
    tr_1_ether = Web3.toWei(1, "ether")
    tr_value = 123
    tx = msw.submitTransaction(
        t.address, tr_1_ether, t.getData(tr_value), {"from": accounts[0]})
    tx.wait(1)
    # assert
    assert msw.getTransactionCount() == 1


def test_confirm_tx():
    # arrange
    msw = deploy_msw(3)
    t = deploy_t()
    # act
    tr_1_ether = Web3.toWei(1, "ether")
    tr_value = 123
    tx = msw.submitTransaction(
        t.address, tr_1_ether, t.getData(tr_value), {"from": accounts[0]})
    tx.wait(1)
    tx_count = msw.getTransactionCount()-1
    tx_confirm = msw.confirmTransaction(tx_count, {"from": accounts[0]})
    tx_confirm.wait(1)
    # assert
    assert msw.isConfirmed(tx_count, accounts[0].address) == True


def test_execute_tx():
    # arrange
    msw = deploy_msw(3)
    t = deploy_t()
    fund_contract()
    # act
    tr_1_ether = Web3.toWei(1, "ether")
    tr_value = 123
    tx = msw.submitTransaction(
        t.address, tr_1_ether, t.getData(tr_value), {"from": accounts[0]})
    tx.wait(1)
    tx_count = msw.getTransactionCount()-1
    print(tx_count)
    tx_confirm = msw.confirmTransaction(tx_count, {"from": accounts[0]})
    tx_confirm.wait(1)
    tx_confirm = msw.confirmTransaction(tx_count, {"from": accounts[1]})
    tx_confirm.wait(1)

    tx = msw.executeTransaction(tx_count, {"from": accounts[0]})
    tx.wait(1)

    # assert
    executed = False
    _address, _value, _data, executed, _numConf = msw.getTransaction(tx_count)
    assert executed == True
