import { useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers"
import Head from "next/head"

import styles from "../styles/Home.module.css"

const deployerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

export default function Home() {
  let provider = null;
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const { provider: ethereum } = provider;
    if (ethereum.isConnected()) {
      ethereum.request({ method: 'eth_accounts' }).then(accountChangledHandler).catch(console.error);
      ethereum.request({ method: 'eth_chainId' }).then(chainChangledHandler).catch(console.error);
    }
    ethereum.on("accountsChanged", accountChangledHandler);
    ethereum.on("chainChanged", chainChangledHandler);
  });

  const accountChangledHandler = (accounts) => {
    setAccount(accounts[0]);
  };

  const chainChangledHandler = (chainId) => {
    setChainId(BigNumber.from(chainId).toString());
  };

  const connectMetaMask = async () => {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setAccount(await signer.getAddress());
    setChainId(await signer.getChainId());
  };

  const network = useMemo(() => {
    if (!chainId) {
      return "";
    }
    return {
      1: "Mainnet",
      3: "Ropsten",
      4: "Rinkeby"
    }[chainId]
  }, [chainId]);

  const makeMetaTransaction = async () => {
    const tokenValue = ethers.utils.parseEther("1");
    const signer = provider.getSigner()

    const transactionRequest = await signer.populateTransaction({
      to: deployerAddress,
      value: tokenValue,
      chainId
    });
    console.log("TX Request:", transactionRequest);

    const signedTransaction = await signer.signTransaction(transactionRequest);
    console.log("Signed Transaction:", signedTransaction);
  };

  const runMetaTransaction = () => {
    console.log("TODO");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Meta Transaction</title>
        <meta name="description" content="Frontend for testing Meta-Transaction" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.section}>
          <div className={styles.button} onClick={connectMetaMask}>
            Connect MetaMask
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.button} onClick={makeMetaTransaction}>
            Make Meta Transaction
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.button} onClick={runMetaTransaction}>
            Run Meta Transaction
          </div>
        </div>
        <div className={styles.section}>
          <p>Network: {network}</p>
          <p>Account: {account}</p>
        </div>
      </main>
    </div>
  )
}
