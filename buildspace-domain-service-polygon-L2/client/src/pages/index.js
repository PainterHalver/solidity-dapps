import Image from "next/image";
import React from "react";
import twitterLogo from "./../assets/twitter-logo.svg";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🍌 Banana Name Service</p>
              <p className="subtitle">Your slippy API on the blockchain!</p>
            </div>
          </header>
        </div>

        <div className="footer-container">
          <div className="twitter-logo">
            <Image alt="Twitter Logo" src={twitterLogo} />
          </div>
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
