import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useWeb3 from "../hooks/useWeb3";
import { TOKEN_ABI, TOKEN_ADDRESS } from "../utils/constants";

export default function Balance() {
  const { walletAddress, provider } = useWeb3();
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!provider || !walletAddress) return;
      try {
        const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
        const balanceRaw = await contract.balanceOf(walletAddress);
        const decimals = await contract.decimals();
        const formatted = ethers.formatUnits(balanceRaw, decimals);
        setBalance(formatted);
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };

    fetchBalance();
  }, [walletAddress, provider]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Your HIP Balance: {balance}</h3>
    </div>
  );
}
