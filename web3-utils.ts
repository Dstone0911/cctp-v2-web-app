/**
 * @file A mock blockchain simulator for demonstrating bridging logic.
 * In a real application, this would be replaced with actual blockchain interactions.
 */

// A simple (and incomplete) acheck for testnet chain IDs
export function isTestnetChainId(chainId: number): boolean {
    // Common testnet chain IDs. This is not an exhaustive list.
    const testnetIds = [
        5, // Goerli
        11155111, // Sepolia
        1337, // Localhost
    ];
    return testnetIds.includes(chainId);
}

/**
 * Validates if a bridging operation is between allowed chain boundaries.
 * In a real-world scenario, this would be part of a comprehensive security model.
 */
export function validateChainIdBoundary(sourceChainId: number, destChainId: number): {
  valid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'success';
} {
  const sourceIsTestnet = isTestnetChainId(sourceChainId);
  const destIsTestnet = isTestnetChainId(destChainId);

  // Bridging from testnet to mainnet is enabled.
  if (sourceIsTestnet && !destIsTestnet) {
    return {
      valid: true,
      message: 'Bridging from testnet to mainnet is enabled.',
      severity: 'success',
    };
  }

  // WARNING: Mainnet to Testnet (unusual but technically allowed)
  if (!sourceIsTestnet && destIsTestnet) {
    return {
      valid: true,
      message: 'WARNING: Bridging from mainnet to testnet is unusual. Proceeding with caution.',
      severity: 'warning',
    };
  }

  // Standard valid scenarios
  return {
    valid: true,
    message: sourceIsTestnet
      ? 'Valid testnet-to-testnet bridge.'
      : 'Valid mainnet-to-mainnet bridge.',
    severity: 'success',
  };
}