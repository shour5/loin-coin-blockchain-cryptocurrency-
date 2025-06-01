import React from "react";
import WalletConnect from "./components/WalletConnect";
import Balance from "./components/Balance";
import TransferForm from "./components/TransferForm";

function App() {
  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#e91e63" }}>🦛 Hippo Coin Dashboard</h1>
      <WalletConnect />
      <Balance />
      <TransferForm />
    </div>
  );
}

export default App;
