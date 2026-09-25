import { ethers } from 'ethers';
import { AccessDecision, BlockchainTransaction } from '../types';

// ABI corresponding to contracts/IoTAccessControl.sol
export const IOT_ACCESS_CONTROL_ABI = [
  "function recordAccess(string memory _deviceId, string memory _resource, uint256 _riskScore, uint256 _trustScore, uint8 _decision, string memory _reason) public returns (uint256)",
  "function getAccessLog(uint256 _id) external view returns (tuple(uint256 id, string deviceId, string resource, uint256 riskScore, uint256 trustScore, uint8 decision, string reason, uint256 timestamp, address recordedBy))",
  "function getAccessLogCount() external view returns (uint256)",
  "function getDeviceLogs(string memory _deviceId) external view returns (uint256[])",
  "event AccessRecorded(uint256 indexed id, string indexed deviceId, string resource, uint256 riskScore, uint256 trustScore, uint8 decision, uint256 timestamp, address indexed recordedBy)",
  "event DeviceStatusAlert(string indexed deviceId, uint8 decision, uint256 riskScore, string reason, uint256 timestamp)"
];

export interface BlockchainStatus {
  mode: 'CONNECTED' | 'SIMULATION MODE';
  isConnected: boolean;
  networkName: string;
  contractAddress: string;
  latestBlock: number;
  totalTransactions: number;
  providerType: 'MetaMask' | 'Custom RPC' | 'Simulated EVM';
  userAccount?: string;
}

export class BlockchainService {
  private static contractAddress =  
  (typeof process !== 'undefined' && process.env?.CONTRACT_ADDRESS) ||  
  '0xd9145CCE52D386f254917e481eB44e9943F39138';
    
  private static rpcUrl = 
    (typeof process !== 'undefined' && process.env?.RPC_URL) || '';

  private static currentBlock = 18492040;
  private static isWeb3Connected = false;
  private static connectedAccount = '';
  private static networkName = 'Simulated EVM Sandbox';

  public static getContractAddress(): string {
    return this.contractAddress;
  }

  public static setContractAddress(addr: string): void {
    if (addr.startsWith('0x') && addr.length === 42) {
      this.contractAddress = addr;
    }
  }

  public static async checkConnection(): Promise<BlockchainStatus> {
    // Check if browser has MetaMask or Web3 provider
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          this.isWeb3Connected = true;
          this.connectedAccount = accounts[0].address;
          this.networkName = `${network.name} (Chain ID: ${network.chainId})`;
          const block = await provider.getBlockNumber();
          this.currentBlock = block;

          return {
            mode: 'CONNECTED',
            isConnected: true,
            networkName: this.networkName,
            contractAddress: this.contractAddress,
            latestBlock: this.currentBlock,
            totalTransactions: 0,
            providerType: 'MetaMask',
            userAccount: this.connectedAccount
          };
        }
      } catch (e) {
        // Fallback to simulation mode if user declines or error occurs
      }
    }

    return {
      mode: 'SIMULATION MODE',
      isConnected: false,
      networkName: 'Simulated EVM Sandbox (Remix Compatible)',
      contractAddress: this.contractAddress,
      latestBlock: this.currentBlock,
      totalTransactions: 0,
      providerType: 'Simulated EVM'
    };
  }

  public static async connectMetaMask(): Promise<boolean> {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        if (accounts.length > 0) {
          this.isWeb3Connected = true;
          this.connectedAccount = accounts[0];
          const network = await provider.getNetwork();
          this.networkName = `${network.name} (Chain ID: ${network.chainId})`;
          return true;
        }
      } catch (err) {
        console.warn('MetaMask connection rejected or failed:', err);
      }
    }
    return false;
  }

  /**
   * Records access control decision to the blockchain (or simulated EVM ledger).
   */
  public static async recordAccessOnChain(
    deviceId: string,
    resource: string,
    riskScore: number,
    trustScore: number,
    decision: AccessDecision,
    reason: string
  ): Promise<BlockchainTransaction> {
    const decisionEnumMap: Record<AccessDecision, number> = {
      DENY: 0,
      LIMITED: 1,
      ALLOW: 2
    };

    // If real Web3 provider & contract are connected:
    if (this.isWeb3Connected && typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, IOT_ACCESS_CONTROL_ABI, signer);

        const tx = await contract.recordAccess(
          deviceId,
          resource,
          Math.round(riskScore),
          Math.round(trustScore),
          decisionEnumMap[decision],
          reason
        );

        const receipt = await tx.wait();
        this.currentBlock = receipt.blockNumber;

        return {
          id: `tx_${Date.now()}`,
          transactionHash: receipt.hash,
          deviceId,
          resource,
          riskScore,
          trustScore,
          decision,
          blockNumber: receipt.blockNumber,
          status: 'Confirmed',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          isSimulated: false,
          gasUsed: Number(receipt.gasUsed || 65400),
          reason,
          contractAddress: this.contractAddress
        };
      } catch (err) {
        console.warn('Live contract execution failed; falling back to simulated ledger:', err);
      }
    }

    // High-Fidelity Simulation Fallback
    this.currentBlock += 1;
    
    // Generate realistic Keccak-256 style hash
    const rawEntropy = `${deviceId}:${resource}:${riskScore}:${trustScore}:${decision}:${Date.now()}:${Math.random()}`;
    const txHash = '0x' + Array.from(rawEntropy)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
      .padEnd(64, 'a9b2c3d4e5f60182')
      .substring(0, 64);

    const gasUsed = 62000 + Math.floor(Math.random() * 8500);

    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      transactionHash: txHash,
      deviceId,
      resource,
      riskScore,
      trustScore,
      decision,
      blockNumber: this.currentBlock,
      status: 'Confirmed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      isSimulated: true,
      gasUsed,
      reason,
      contractAddress: this.contractAddress
    };
  }
}
