import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Zama Grid Selection',
  projectId: 'YOUR_PROJECT_ID', // Replace with your WalletConnect Project ID
  chains: [sepolia],
  ssr: false,
});
