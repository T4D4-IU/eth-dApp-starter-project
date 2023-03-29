import React, { useEffect, useState } from 'react';
import "./App.css";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
const App = () => {
  /* ユーザーのパブリックウォレットを保持する為に使用する状態変数を定義します */
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount", currentAccount);
  /*
  * デプロイされたコントラクトのアドレスを保持する変数を定義します。
  */
  const contractAddress = "0x85D887383274DefCa93BbeF296c648182464D8E6";
  /*
  * ABIの内容を参照する変数を作成します。
  */
  const contractABI = abi.abi;
  /* window.etherumにアクセス出来るか確認します */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      /* ユーザのウォレットへのアクセスが許可されているかどうかを確認します */
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // connectWalletメソッドを実装します
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /* ユーザのウォレットへのアクセスが許可されているかどうかを確認します */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }
  // waveの回数をカウントする関数を実装
  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        /* コントラクトに書き込む */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  /*
  * WEBページがロードされた時に下記の関数を実行します。
  */
useEffect(() => {
  checkIfWalletIsConnected();
}, []);
return (
  <div className="mainContainer">
    <div className="dataContainer">
      <div className="header">
        <span role="img" aria-label="hard-wave">
          👋
        </span>{" "}
        WELCOME!
      </div>
      <div className="bio">
        イーサリアムウォレットを接続して！「
        <span role="img" aria-label="hard-wave">
          👋
        </span>
        (wave)」を送ってください
        <span role="img" aria-label="shine">
          ✨
        </span>
      </div>
      {/* waveボタンにwave関数を連動させる。 */}
      <button className="waveButton" onClick={wave}>
        Wave at Me
      </button>
      {/* ウォレットコネクトボタンの実装 */}
      {!currentAccount && (
        <button className="walletButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      {currentAccount && (
        <button className="walletButton" onClick={connectWallet}>
          Wallet Connected
        </button>
      )}
      </div>
    </div>
  );
};
export default App;