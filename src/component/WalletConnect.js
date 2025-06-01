import React from "react";
import useWeb3 from "../hooks/useWeb3";

export default function WalletConnect() {
  const { walletAddress, connectWallet, disconnectWallet } = useWeb3();

  return (
    <div style={{ marginBottom: "20px" }}>
      {walletAddress ? (
        <div>
          <p><strong>Connected:</strong> {walletAddress}</p>
          <button onClick={disconnectWallet} style={{ padding: "10px" }}>
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={connectWallet} style={{ padding: "10px" }}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
