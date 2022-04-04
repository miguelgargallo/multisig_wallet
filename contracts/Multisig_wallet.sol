// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
import "./console.sol";

contract MultiSigWallet {
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public numConfirmationsRequired;
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
    }
    // mapping from tx index => owner => bool
    mapping(uint256 => mapping(address => bool)) public isConfirmed;
    Transaction[] public transactions;

    // Modifiers
    modifier onlyOwner() {
        console.log("onlyOwner() called");
        require(isOwner[msg.sender], "not owner");
        _;
        console.log("onlyOwner() passed");
    }

    modifier txExists(uint256 _txIndex) {
        console.log("txExists(%d) called", _txIndex);
        require(_txIndex < transactions.length, "tx does not exist");
        _;
        console.log("txExists() passed");
    }

    modifier notExecuted(uint256 _txIndex) {
        console.log("notExecuted(%d) called", _txIndex);
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
        console.log("notExecuted() passed");
    }

    modifier notConfirmed(uint256 _txIndex) {
        console.log("notConfirmed(%d) called", _txIndex);
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
        console.log("notConfirmed() passed");
    }

    // constructor
    constructor(address[] memory _owners, uint256 _numConfirmationsRequired) {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
        console.log("Constructor() called");
    }

    receive() external payable {
        console.log("MultiSigWallet.receive(), msg.value is %d", msg.value);
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTransaction(
        address _to,
        uint256 _value,
        bytes memory _data
    ) public onlyOwner {
        transactions.push(
            Transaction({to: _to, value: _value, data: _data, executed: false})
        );
        emit SubmitTransaction(
            msg.sender,
            transactions.length - 1,
            _to,
            _value,
            _data
        );
        console.log(
            "submitTransaction(), transaction %d created",
            transactions.length - 1
        );
    }

    function confirmTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        console.log("confirmTransaction() called for tx %d", _txIndex);
        isConfirmed[_txIndex][msg.sender] = true;
        emit ConfirmTransaction(msg.sender, _txIndex);
        console.log("Transaction %d confirmed by %s", _txIndex, msg.sender);
    }

    function _getApprovalCount(uint256 _txIndex)
        private
        view
        returns (uint256 count)
    {
        for (uint256 i; i < owners.length; i++) {
            if (isConfirmed[_txIndex][owners[i]]) {
                count += 1;
            }
        }
    }

    function executeTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        console.log("executeTransaction() called");
        Transaction storage transaction = transactions[_txIndex];
        require(
            _getApprovalCount(_txIndex) >= numConfirmationsRequired,
            "approvals < required"
        );
        transaction.executed = true;
        console.log(
            "executeTransaction() low-level call, value=%d, data=",
            transaction.value
        );
        console.logBytes(transaction.data);
        (bool success, bytes memory returnData) = transaction.to.call{
            value: transaction.value
        }(transaction.data);
        console.log("returnData=");
        console.logBytes(returnData);
        require(success, "tx failed");
        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");
        isConfirmed[_txIndex][msg.sender] = false;
        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction memory transaction = transactions[_txIndex];
        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            _getApprovalCount(_txIndex)
        );
    }
}

contract TestContract {
    uint256 public i;

    fallback() external payable {
        console.log("TestContract.fallback()");
        console.logBytes(msg.data);
    }

    receive() external payable {
        console.log("TestContract.receive()");
    }

    function callMe(uint256 j, uint256 a) public payable {
        console.log("TestContract.callMe(%d,%d) called", j, a);
        i += j;
    }

    // Uncomment these two functions if you want to test the result of encoding
    // the call from Solidity from the result of encoding with contract.method.encode_input
    // function getData(uint256 j, uint256 a) public view returns (bytes memory) {
    //     console.log("callMe(uint256,uint256),j,a encoded:");
    //     console.logBytes(
    //         abi.encodeWithSignature("callMe(uint256,uint256)", j, a)
    //     );
    //     return abi.encodeWithSignature("callMe(uint256,uint256)", j, a);
    // }
    // function getDataString(string memory abc)
    //     public
    //     view
    //     returns (bytes memory)
    // {
    //     console.log("callMeString(string),abc encoded:");
    //     console.logBytes(abi.encodeWithSignature("callMeString(string)", abc));
    //     return abi.encodeWithSignature("callMeString(string)", abc);
    // }

    function callMeString(string memory abc) public payable {
        console.log("TestContract.callMeString('%s') called", abc);
        i++;
    }
}
