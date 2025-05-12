import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        84532: "https://sepolia.base.org",
        11155111: "https://rpc.sepolia.org"
      }
    }
  }
};