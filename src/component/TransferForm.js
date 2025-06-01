import React, { useState } from "react";
import { ethers } from "ethers";
import useWeb3 from "../hooks/useWeb3";
import { TOKEN_ABI, TOKEN_ADDRESS } from "../utils/constants";

export default function TransferForm() {
  const { signer } = useWeb3();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!signer) return alert("Wallet not connected.");

    try {
      setStatus("Transferring...");
      const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
      const decimals = await contract.decimals();
      const parsedAmount = ethers.parseUnits(amount, decimals);
      const tx = await contract.transfer(to, parsedAmount);
      await tx.wait();
      setStatus("✅ Transfer successful!");
      setAmount("");
      setTo("");
    } catch (err) {
      console.error("Transfer failed:", err);
      setStatus("❌ Transfer failed. See console.");
    }
  };

  return (
    <form onSubmit={handleTransfer} style={{ marginTop: "20px" }}>
      <h3>Send HIP Tokens</h3>
      <input
        type="text"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
        required
      />
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
        required
      />
      <button type="submit" style={{ padding: "10px 20px" }}>Transfer</button>
      <p>{status}</p>
    </form>
  );
}
