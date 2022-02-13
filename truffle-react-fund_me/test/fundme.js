const FundMe = artifacts.require("FundMe");

contract("FundMe", (accounts) => {
  let fundMe;
  const deployer = accounts[0];

  beforeEach(async () => {
    fundMe = await FundMe.deployed();
    console.log(fundMe.address);
  });

  // it("should have no initial balances", async () => {
  //   console.log(fundMe.address);
  //   assert.equal(
  //     await web3.eth.getBalance(fundMe.address),
  //     0,
  //     "Balance is not 0!"
  //   );
  // });

  it("should receive money when funded", async () => {
    const initialBalance = Number(await web3.eth.getBalance(fundMe.address));
    await fundMe.fund({
      from: deployer,
      value: web3.utils.toWei("0.001", "ether"),
    });
    assert.equal(
      Number(await web3.eth.getBalance(fundMe.address)),
      Number(web3.utils.toWei("0.001", "ether")) + initialBalance
    );
  });

  it("should have no balance left when withdrawn", async () => {
    await fundMe.withdraw({ from: deployer });
    assert.equal(await web3.eth.getBalance(fundMe.address), "0");
  });
});
