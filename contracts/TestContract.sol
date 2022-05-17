// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

contract TestContract {
    uint256 public i;
    string public abc;

    fallback() external payable {}
    receive() external payable {}

    function callMe(uint256 j, uint256 a) public payable {
        i += j+a;
    }

    // Uncomment these two functions if you want to test the result of encoding
    // the call from Solidity from the result of encoding with contract.method.encode_input
    // function getData(uint256 j, uint256 a) public view returns (bytes memory) {
    //     return abi.encodeWithSignature("callMe(uint256,uint256)", j, a);
    // }
    // function getDataString(string memory abc)
    //     public
    //     view
    //     returns (bytes memory)
    // {
    //     return abi.encodeWithSignature("callMeString(string)", abc);
    // }

    function callMeString(string memory _abc) public payable {
        i++;
        abc=_abc;
    }
}
