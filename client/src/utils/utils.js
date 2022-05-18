import { BigNumber, constants, utils } from "ethers";

function shortenString(str) {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
}

export function shortenAddress(address) {
  try {
    const formattedAddress = utils.getAddress(address);
    return shortenString(formattedAddress);
  } catch {
    throw new TypeError("Invalid input, address can't be parsed");
  }
}

const formatter = new Intl.NumberFormat("en-us", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export const formatBalance = (balance) =>
  formatter.format(
    parseFloat(utils.formatEther(balance ?? BigNumber.from("0")))
  );
