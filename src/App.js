import { useCallback, useEffect, useState } from "react";
import "./App.css";
import detectEthereumProvider from "@metamask/detect-provider";
import web3 from "web3";
import { loadContract } from "./utils/loadContract";

function App() {
  const [account, setAccount] = useState(null);
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [balance, setBalance] = useState(null);
  const [shouldReload, setShouldReload] = useState(false);

  const reloadEffect = () => setShouldReload(!shouldReload);

  const setAccountLister = (provider) => {
    provider.on("accountChanged", (accounts) => setAccount(accounts[0]));
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);
      // debugger;
      if (provider) {
        setAccountLister(provider);
        setWeb3Api({ provider, contract, web3: new web3(provider) });
      } else console.error("Please install Metamask extension!");
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      console.log(accounts);
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount() && reloadEffect();
  }, [web3Api.web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      // debugger;
      console.log(balance);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    reloadEffect();
  }, [web3Api, account]);

  const withDraw = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("1", "ether");
    await contract.withDraw(withdrawAmount, {
      from: account,
    });
    reloadEffect();
  }, [web3Api, account]);

  return (
    <div className="App">
      <div className="faucet-wrapper">
        <div className="balance-view is-size-2">
          Balance: <strong>{balance}</strong> ETH
        </div>
        <button className="button is-primary mr-5" onClick={addFunds}>
          Donate
        </button>
        <button className="button is-danger mr-5" onClick={withDraw}>
          Withdraw
        </button>
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
