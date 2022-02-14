const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const clapContractFactory = await hre.ethers.getContractFactory("ClapParty");
  const clapContract = await clapContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  // const clapContract = await clapContractFactory.deploy();
  await clapContract.deployed();

  console.log("Contract deployed to:", clapContract.address);
  console.log("Contract deployed by:", owner.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    clapContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let clapTxn = await clapContract.clap("A message1!");
  await clapTxn.wait();

  clapTxn = await clapContract.clap("A message2!");
  await clapTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(clapContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allClaps = await clapContract.getAllClaps();
  console.log(allClaps);
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
