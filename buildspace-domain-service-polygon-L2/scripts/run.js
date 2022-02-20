const main = async () => {
  // The first return is the deployer, the second is a random account
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();

  console.log("Banana deployed to:", domainContract.address);
  console.log("Banana deployed by:", owner.address);

  let txn = await domainContract.register("doom", {
    value: hre.ethers.utils.parseEther("0.05"),
  });
  await txn.wait();

  const domainAddress = await domainContract.getAddress("doom");
  console.log("Owner of domain doom:", domainAddress);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  const addrBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Contract balacne:", hre.ethers.utils.formatEther(balance));
  console.log(addrBalance);
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
