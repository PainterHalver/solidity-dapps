import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ethers } from "ethers";
import "./App.css";
import ClapPortal from "./utils/ClapParty.json";

dayjs.extend(relativeTime);

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [clapCount, setClapCount] = useState("--");
  const [contract, setContract] = useState(null);
  const [allClaps, setAllClaps] = useState([]);

  const contractAddress = "0x8EB5EC260c70133111468d081b220cceCA0145b0";
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
          getAllClaps();
          (await getContract()).on("NewClap", (from, timestamp, message) => {
            setAllClaps((prevState) => [
              ...prevState.reverse(),
              {
                address: from,
                timestamp: new Date(timestamp * 1000),
                message: message,
              },
            ]);
          });
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
      setClapCount((await (await getContract()).getTotalClaps()).toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const clap = async (e) => {
    e.preventDefault();
    try {
      const { ethereum } = window;
      if (ethereum) {
        const clapTxn = await contract.clap(messageValue, { gasLimit: 300000 });
        console.log("Mining...", clapTxn.hash);
        await clapTxn.wait();
        console.log("Mined -- ", clapTxn.hash);
        setMessageValue("");

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

  const getAllClaps = async () => {
    try {
      const claps = await (await getContract()).getAllClaps();

      let clapsCleaned = [];
      claps.forEach((clap) => {
        clapsCleaned.push({
          address: clap.clapper,
          timestamp: new Date(clap.timestamp * 1000),
          message: clap.message,
        });
      });

      setAllClaps(clapsCleaned.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">Hello there! 👏</div>

        <div className="bio">
          If my projects interest you in anyway, or if you are just a little
          delighted at the moment, or if nothing actually :D, send me a 👏 with
          a message.
          <p>
            It will be shown right down there so you and everybody can see it!
          </p>
          <p>
            Still not interested in clapping? Here's a little incentive: There
            will be some small amount of ETH sent to the clapper everytime the
            total claps count reaches a multiple of x. Take a look at the{" "}
            <a
              href={`https://rinkeby.etherscan.io/address/${contractAddress}`}
              target="_blank"
            >
              smart contract
            </a>{" "}
            to find out what x is! 😉
          </p>
          <p>
            Okay because I'm a long-tempered person, I will give you another 30%
            chance every clap to get the reward. Now type in some words and clap
            the hell out of me!
          </p>
          <p>To date, I have received {clapCount} claps!</p>
        </div>

        <form onSubmit={clap} id="clap-form" className="form-message">
          <input
            type="text"
            placeholder="Your message"
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="input-message"
          />
        </form>

        <button className="clapButton" type="submit" form="clap-form">
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

        {allClaps.map((clap, index) => {
          return (
            <div key={index} className="messages-container">
              <div>Address: {clap.address}</div>
              <div>Time: {dayjs(clap.timestamp.toString()).fromNow()}</div>
              <div>Message: {clap.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
