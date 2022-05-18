import { useContractRead, useAccount } from "wagmi";
import { constants } from "ethers";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

const GetOwner = ({ index, activeChain, contractAddress, contractABI }) => {
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
      args: [parseInt(index)],
      enabled: Boolean(
        activeChain && contractAddress !== constants.AddressZero
      ),
    }
  );

  return (
    <TableRow key={index} selected={owner === account?.address}>
      <TableCell align="left">{owner}</TableCell>
    </TableRow>
  );
};

export default GetOwner;
