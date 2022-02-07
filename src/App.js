import { useEffect, useState } from "react";
import "./App.css";
import detectEthereumProvider from "@metamask/detect-provider";
import web3 from "web3";

function App() {
  const [account, setAccount] = useState(null);
  const [web3Api, setWeb3Api] = useState({ provider: null, web3: null });

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setWeb3Api({ provider, web3: new web3(provider) });
      } else console.error("Please install Metamask extension!");
    };
    loadProvider();
  }, []);
  console.log(web3Api);
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      console.log(accounts);
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);
  // console.log(account);
  return (
    <div className="App">
      <div className="faucet-wrapper">
        <div className="balance-view is-size-2">
          Blance: <strong>100 ETH</strong>
        </div>
        <button className="button is-primary mr-5">Donate</button>
        <button className="button is-danger mr-5">Withdraw</button>
        <button
          className="button is-link"
          onClick={() =>
            web3Api.provider.request({ method: "eth_requestAccounts" })
          }
        >
          Connect to Wallet
        </button>
        <span>
          <p>
            <strong>Accounts Address: </strong>
            {account ? account : "Accounts Denined"}
          </p>
        </span>
      </div>
    </div>
  );
}

export default App;
