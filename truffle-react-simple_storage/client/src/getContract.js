import { ethers } from "ethers";

export const getContract = async (provider, contractJSON) => {
  const { chainId } = await provider.getNetwork();

  const contractAddress = contractJSON.networks[chainId].address;

  const contract = new ethers.Contract(
    contractAddress,
    contractJSON.abi,
    provider.getSigner()
  );
  console.log({ chainId, contractJSON, contractAddress, contract });

  return contract;
};
