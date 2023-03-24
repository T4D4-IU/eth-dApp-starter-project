// App.js
import React, { useEffect, useState } from 'react';
import "./App.css";
const App = () => {
  /* ユーザーのパブリックウォレットを保持する為に使用する状態変数を定義します */
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount", currentAccount);
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
  // connectWalletメソッドを定義します
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
      <button className="waveButton" onClick={null}>
        Wave at Me
      </button>
      {/* ウォレットコネクトボタンの実装 */}
      {!currentAccount && (
        <button className="walletButton" onClick={connectWallet}>
          wallet Connected
        </button>
      )}
      </div>
    </div>
  );
};
export default App;