import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";

import { useIsMounted, useGetOwnersCount } from "../hooks";
import { addressNotZero } from "../utils/utils";
import { ShowError } from "./";

const GetOwner = ({
  idxOwner,
  account,
  activeChain,
  contractAddress,
  contractABI,
}) => {
  const isMounted = useIsMounted();
  const {
    data: owner,
    isLoading: isLoadingOwner,
    isError: isErrorOwner,
    error: errorOwner,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "owners",
    {
      args: [BigNumber.from(idxOwner)],
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  return (
    <>
      {isMounted && !isLoadingOwner && (
        <>
          {isErrorOwner ? (
            <TableRow key={idxOwner} selected={true}>
              <TableCell align="left">
                <ShowError flag={isErrorOwner} error={errorOwner} />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={idxOwner} selected={owner === account?.address}>
              <TableCell align="left">{owner}</TableCell>
            </TableRow>
          )}
        </>
      )}
    </>
  );
};

const GetOwners = ({ activeChain, contractAddress, contractABI, account }) => {
  const isMounted = useIsMounted();
  const ownersCount = useGetOwnersCount(
    activeChain,
    contractAddress,
    contractABI
  );

  // just to have an array of the size of ownersCount, to iterate correctly
  const ownersArray = [
    ...Array.from({ length: parseInt(ownersCount) }, (_, idx) => `${++idx}`),
  ];

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      padding={1}
    >
      {isMounted && (
        <>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="owners">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Owners</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ownersArray?.map((_, index) => {
                  return (
                    <GetOwner
                      key={index}
                      idxOwner={index}
                      account={account}
                      contractAddress={contractAddress}
                      contractABI={contractABI}
                      activeChain={activeChain}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Stack>
  );
};

export default GetOwners;
