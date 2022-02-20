const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  // CHANGE THIS DOMAIN TO SOMETHING ELSE! I don't want to see OpenSea full of bananas lol
  let txn = await domainContract.register("black", {
    value: hre.ethers.utils.parseEther("0.05"),
  });
  await txn.wait();
  console.log("Minted domain black.banana");

  txn = await domainContract.setRecord("black", "Am I a black or a banana??");
  await txn.wait();
  console.log("Set record for black.banana");

  const address = await domainContract.getAddress("black");
  console.log("Owner of domain black:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
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
