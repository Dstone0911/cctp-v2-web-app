"use client";

import { useState, useEffect } from "react";
import { useCrossChainTransfer } from "@/hooks/use-cross-chain-transfer";
import { CHAIN_TO_CHAIN_NAME, SUPPORTED_CHAINS } from "@/lib/chains";

export default function Home() {
  const {
    currentStep,
    logs,
    error,
    executeTransfer,
    getBalance,
    reset,
  } = useCrossChainTransfer();

  const [sourceChain, setSourceChain] = useState<number>(
    SUPPORTED_CHAINS[0],
  );
  const [destinationChain, setDestinationChain] = useState<number>(
    SUPPORTED_CHAINS[1],
  );
  const [amount, setAmount] = useState<string>("1.0");
  const [balances, setBalances] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchBalances = async () => {
      const newBalances: Record<number, string> = {};
      for (const chainId of SUPPORTED_CHAINS) {
        try {
          const balance = await getBalance(chainId);
          newBalances[chainId] = balance;
        } catch (error) {
          console.error(`Failed to get balance for chain ${chainId}:`, error);
          newBalances[chainId] = "Error";
        }
      }
      setBalances(newBalances);
    };

    fetchBalances();
  }, [getBalance]);

  const handleTransfer = async () => {
    await executeTransfer(
      sourceChain,
      destinationChain,
      amount,
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Cross-Chain Transfer Protocol (CCTP) Sample
        </h1>

        {currentStep === "idle" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Source Chain
              </label>
              <select
                value={sourceChain}
                onChange={(e) => setSourceChain(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {SUPPORTED_CHAINS.map((chainId) => (
                  <option key={chainId} value={chainId}>
                    {CHAIN_TO_CHAIN_NAME[chainId]} (Balance:{" "}
                    {balances[chainId] || "Loading..."} USDC)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Destination Chain
              </label>
              <select
                value={destinationChain}
                onChange={(e) => setDestinationChain(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {SUPPORTED_CHAINS.map((chainId) => (
                  <option key={chainId} value={chainId}>
                    {CHAIN_TO_CHAIN_NAME[chainId]} (Balance:{" "}
                    {balances[chainId] || "Loading..."} USDC)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (USDC)
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>

            <button
              onClick={handleTransfer}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Initiate Transfer
            </button>
          </div>
        )}

        {currentStep !== "idle" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Transfer Status</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-center text-lg capitalize">{currentStep.replace("-", " ")}</p>
              <div className="mt-4 h-64 overflow-y-auto bg-black text-white p-4 rounded-md font-mono text-sm">
                {logs.map((log, i) => (
                  <p key={i}>{log}</p>
                ))}
              </div>
              {error && <p className="text-red-500 mt-4">Error: {error}</p>}
              {(currentStep === "completed" || currentStep === "error") && (
                <button
                  onClick={reset}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  New Transfer
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
