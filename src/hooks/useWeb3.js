import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function useWeb3() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await ethProvider.getSigner();
          const address = await signer.getAddress();
          setProvider(ethProvider);
          setSigner(signer);
          setWalletAddress(address);
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    try {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await ethProvider.getSigner();
      const address = await signer.getAddress();
      setProvider(ethProvider);
      setSigner(signer);
      setWalletAddress(address);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setWalletAddress("");
  };

  return {
    provider,
    signer,
    walletAddress,
    connectWallet,
    disconnectWallet,
  };
}
