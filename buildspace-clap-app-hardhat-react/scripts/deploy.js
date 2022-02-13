const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const clapContractFactory = await hre.ethers.getContractFactory("ClapParty");
  const clapContract = await clapContractFactory.deploy();
  await clapContract.deployed();

  console.log("ClapParty address: ", clapContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
