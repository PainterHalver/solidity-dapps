import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import ClapPortal from "./utils/ClapParty.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [clapCount, setClapCount] = useState("--");
  const [contract, setContract] = useState(null);

  const contractAddress = "0x11ba990d7cd2Bd83267cF253c06cc1588D7cc7ab";
  const contractABI = ClapPortal.abi;
  const { ethereum } = window;

  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    // You need to connect to metamask to get singer
    const clapPartyContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    setContract(() => clapPartyContract);
    return clapPartyContract;
  };

  useEffect(() => {
    (async () => {
      // checkIfWalletIsConnected
      try {
        if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(() => account);
          setClapCount(
            (await (await getContract()).getTotalClaps()).toNumber()
          );
        } else {
          console.log("No authorized account found");
        }
      } catch (error) {
        console.log(error);
      }
    })();

    // ON ACCOUNT CHANGED
    ethereum.on("accountsChanged", (accounts) => {
      setCurrentAccount(() => accounts[0]);
      getContract(); // Because contract depend on signer to know who is calling
    });
    // RELOAD ON CHAIN CHANGED
    ethereum.on("chainChanged", (chainID) => {
      window.location.reload(true);
    });
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setClapCount((await contract.getTotalClaps()).toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const clap = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const clapTxn = await contract.clap();
        console.log("Mining...", clapTxn.hash);
        await clapTxn.wait();
        console.log("Mined -- ", clapTxn.hash);

        let count = await contract.getTotalClaps();
        console.log("Retrieved total clap count...", count.toNumber());
        setClapCount(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">Yo buddy!</div>

        <div className="bio">
          If my projects interest you somehow in anyway, send me a 👏. I would
          really appreciate it!
          <p>To date, I have received {clapCount} claps!</p>
        </div>

        <button className="clapButton" onClick={clap}>
          Clap At Me
        </button>
        {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="clapButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
