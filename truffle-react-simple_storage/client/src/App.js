import React, { useEffect, useState } from "react";
import { getContract } from "./getContract";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import { ethers } from "ethers";

export default function App() {
  const [currentNumber, setCurrentNumber] = useState(997744);
  const [currentValue, setCurrentValue] = useState("");
  const [connectBtnText, setConnectBtnText] = useState(
    "Connect Metamask To Rinkeby!"
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [provider, setProvider] = useState(
    () => new ethers.providers.Web3Provider(window.ethereum)
  );
  const [contract, setContract] = useState(null);

  useEffect(() => {
    metamaskHandler();
  }, []);

  useEffect(() => {
    (async () => {
      setContract(await getContract(provider, SimpleStorageContract));
    })();
  }, [provider]); // only runs after there is a provider

  const metamaskHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          accountChangedHandler(accounts[0]);
          setConnectBtnText("Connected");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setCurrentAccount(newAccount);
    updateSignerAndContract();
  };

  const chainChangedHandler = () => {
    setProvider(new ethers.providers.Web3Provider(window.ethereum));
    window.location.reload();
  };

  // listen for important events
  window.ethereum.on("accountsChanged", accountChangedHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  const updateSignerAndContract = async () => {
    setProvider(new ethers.providers.Web3Provider(window.ethereum));
    setContract(await getContract(provider, SimpleStorageContract));
  };

  const getNumber = async (e) => {
    const hex = await contract.get();
    const number = await hex.toNumber();
    setCurrentNumber(number);
  };

  const setNumber = async (e) => {
    e.preventDefault();
    const tx = await contract.set(currentValue);
    await tx.wait();
    console.log("Done!!");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen py-6 text-lg bg-gradient-to-br from-blue-700 via-green-400 to-gray-400 overlay">
      <div className="container relative flex flex-col items-center justify-around h-full max-w-5xl py-3 bg-green-200 rounded-md shadow-xl">
        <button
          className="absolute px-3 py-2 btn top-2 right-4"
          onClick={metamaskHandler}
        >
          {connectBtnText}
        </button>
        <div className="flex flex-col items-center justify-around">
          <div className="text-4xl">Current Number</div>
          <div className="mt-6 text-3xl">{currentNumber}</div>
          <button className="px-6 py-2 mt-9 btn" onClick={getNumber}>
            Get
          </button>
        </div>
        <form className="flex flex-col items-center" onSubmit={setNumber}>
          <input
            type="text"
            placeholder="Number"
            className="px-5 py-2 mb-4 text-center rounded focus:outline-none"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
          <button type="submit" className="px-6 py-2 mt-6 btn">
            Set
          </button>
        </form>
      </div>
    </div>
  );
}
