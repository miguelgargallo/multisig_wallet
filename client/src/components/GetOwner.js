import { useContractRead, useAccount } from "wagmi";
import { BigNumber, constants } from "ethers";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import { useIsMounted } from "../hooks";

const GetOwner = ({ index, activeChain, contractAddress, contractABI }) => {
  const isMounted = useIsMounted();
  const {
    data: account,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
  } = useAccount({
    enabled: Boolean(activeChain && contractAddress !== constants.AddressZero),
  });
  const { data: owner } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "owners",
    {
      args: [BigNumber.from(index)],
      enabled: Boolean(
        activeChain && contractAddress !== constants.AddressZero
      ),
    }
  );
  return (
    <>
      {isMounted ? (
        <TableRow key={index} selected={owner === account?.address}>
          <TableCell align="left">{owner}</TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell align="left"></TableCell>
        </TableRow>
      )}
    </>
  );
};

export default GetOwner;
