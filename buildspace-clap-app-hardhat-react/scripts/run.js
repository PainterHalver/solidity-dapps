const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const clapContractFactory = await hre.ethers.getContractFactory("ClapParty");
  const clapContract = await clapContractFactory.deploy();
  await clapContract.deployed();

  console.log("Contract deployed to:", clapContract.address);
  console.log("Contract deployed by:", owner.address);

  let clapCount;
  clapCount = await clapContract.getTotalClaps();

  let clapTxn = await clapContract.clap();
  await clapTxn.wait();

  clapCount = await clapContract.getTotalClaps();

  clapTxn = await clapContract.connect(randomPerson).clap();
  await clapTxn.wait();

  clapCount = await clapContract.getTotalClaps();
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
