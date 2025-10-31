import { useMemo, useState } from 'react';
import { Contract } from 'ethers';
import { useAccount, useReadContract } from 'wagmi';
import { Header } from './Header';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import '../styles/GridSelectionApp.css';

const CELL_IDS = Array.from({ length: 16 }, (_, index) => index + 1);
const DURATION_IN_DAYS = "10";

function encodeCells(cells: number[]): number {
  return cells.reduce((mask, cell) => mask | (1 << (cell - 1)), 0);
}

function decodeCells(mask: number): number[] {
  return CELL_IDS.filter((cell) => (mask & (1 << (cell - 1))) !== 0);
}

export function GridSelectionApp() {
  const { address, isConnected } = useAccount();
  const { instance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();
  const signerPromise = useEthersSigner();

  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [decryptedCells, setDecryptedCells] = useState<number[]>([]);
  const [decryptedMask, setDecryptedMask] = useState<number | null>(null);

  const {
    data: hasSelectionData,
    refetch: refetchHasSelection,
    isFetching: hasSelectionLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasSelection',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const hasSelection = hasSelectionData === true;

  const {
    data: encryptedSelectionData,
    refetch: refetchSelection,
    isFetching: selectionLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getSelection',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && hasSelection,
    },
  });

  const encryptedSelection = useMemo(() => {
    if (!hasSelection || !encryptedSelectionData) {
      return null;
    }
    return encryptedSelectionData as string;
  }, [encryptedSelectionData, hasSelection]);

  const toggleCell = (cellId: number) => {
    setSelectedCells((prev) => {
      if (prev.includes(cellId)) {
        return prev.filter((id) => id !== cellId);
      }
      const next = [...prev, cellId];
      next.sort((a, b) => a - b);
      return next;
    });
  };

  const saveSelection = async () => {
    if (!isConnected) {
      setErrorMessage('Connect your wallet to save a selection.');
      return;
    }
    if (!address) {
      setErrorMessage('Wallet address unavailable.');
      return;
    }
    if (!instance || zamaLoading) {
      setErrorMessage('Encryption service is not ready yet.');
      return;
    }
    if (!signerPromise) {
      setErrorMessage('Wallet signer is unavailable.');
      return;
    }

    setIsSaving(true);
    setStatusMessage('Encrypting selection...');
    setErrorMessage(null);
    setDecryptedCells([]);
    setDecryptedMask(null);

    try {
      const mask = encodeCells(selectedCells);
      const encryptedInput = await instance
        .createEncryptedInput(CONTRACT_ADDRESS, address)
        .add16(mask)
        .encrypt();

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available.');
      }

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setStatusMessage('Submitting transaction...');
      const tx = await contract.saveSelection(encryptedInput.handles[0], encryptedInput.inputProof);
      setStatusMessage('Waiting for confirmation...');
      await tx.wait();

      setStatusMessage('Selection stored successfully.');
      await refetchHasSelection();
      await refetchSelection();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error while saving selection.';
      setErrorMessage(message);
      setStatusMessage(null);
    } finally {
      setIsSaving(false);
    }
  };

  const decryptSelection = async () => {
    if (!isConnected || !address) {
      setErrorMessage('Connect your wallet to decrypt saved selections.');
      return;
    }
    if (!instance || zamaLoading) {
      setErrorMessage('Encryption service is not ready yet.');
      return;
    }
    if (!signerPromise) {
      setErrorMessage('Wallet signer is unavailable.');
      return;
    }
    if (!encryptedSelection) {
      setErrorMessage('No encrypted selection found.');
      return;
    }

    setIsDecrypting(true);
    setStatusMessage('Preparing decryption request...');
    setErrorMessage(null);

    try {
      const keypair = instance.generateKeypair();
      const startTimestamp = Math.floor(Date.now() / 1000).toString();
      const contractAddresses = [CONTRACT_ADDRESS];

      const eip712 = instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimestamp,
        DURATION_IN_DAYS
      );

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available.');
      }

      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message
      );

      const decryptedMap = await instance.userDecrypt(
        [{ handle: encryptedSelection, contractAddress: CONTRACT_ADDRESS }],
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimestamp,
        DURATION_IN_DAYS
      );

      const decryptedValue = decryptedMap[encryptedSelection] ?? '0';
      const bitmask = Number(BigInt(decryptedValue));
      setDecryptedMask(bitmask);
      setDecryptedCells(decodeCells(bitmask));
      setStatusMessage('Selection decrypted successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error while decrypting selection.';
      setErrorMessage(message);
      setStatusMessage(null);
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="grid-app">
      <Header />
      <main className="grid-main">
        <section className="grid-card">
          <header className="grid-card-header">
            <div>
              <h2 className="grid-card-title">Encrypted Grid Selection</h2>
              <p className="grid-card-subtitle">
                Choose any cells in the 4×4 grid, encrypt them with Zama, and store
                the encrypted bitmask on-chain.
              </p>
            </div>
            <div className="grid-status">
              {zamaLoading && <span className="status-pill">Initializing encryption…</span>}
              {hasSelectionLoading && <span className="status-pill">Fetching selection…</span>}
              {selectionLoading && <span className="status-pill">Loading encrypted data…</span>}
              {zamaError && <span className="status-error">Encryption service unavailable</span>}
            </div>
          </header>

          <div className="grid-content">
            <div className="grid-wrapper">
              {CELL_IDS.map((cellId) => {
                const isSelected = selectedCells.includes(cellId);
                return (
                  <button
                    key={cellId}
                    type="button"
                    className={`grid-cell ${isSelected ? 'grid-cell-selected' : ''}`}
                    onClick={() => toggleCell(cellId)}
                    disabled={isSaving}
                  >
                    {cellId}
                  </button>
                );
              })}
            </div>

            <div className="grid-actions">
              <div className="selection-summary">
                <h3 className="summary-title">Current Selection</h3>
                <p className="summary-text">
                  {selectedCells.length > 0
                    ? selectedCells.join(', ')
                    : 'No cells selected'}
                </p>
              </div>

              <button
                type="button"
                className="primary-button"
                onClick={saveSelection}
                disabled={isSaving || zamaLoading || !isConnected}
              >
                {isSaving ? 'Saving…' : 'Encrypt & Save'}
              </button>
            </div>
          </div>

          <footer className="grid-footer">
            <div className="history-section">
              <h3 className="summary-title">Saved Selection</h3>
              {hasSelection && encryptedSelection ? (
                <div className="history-details">
                  <p className="summary-text">
                    <span className="label">Encrypted handle:</span>
                    <code className="code">{encryptedSelection}</code>
                  </p>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={decryptSelection}
                    disabled={isDecrypting || zamaLoading || !isConnected}
                  >
                    {isDecrypting ? 'Decrypting…' : 'Decrypt & View'}
                  </button>
                </div>
              ) : (
                <p className="summary-text">
                  No encrypted selection stored for this wallet.
                </p>
              )}

              {decryptedMask !== null && (
                <div className="decrypted-result">
                  <p className="summary-text">
                    <span className="label">Decrypted bitmask:</span> {decryptedMask}
                  </p>
                  <p className="summary-text">
                    <span className="label">Cells:</span>{' '}
                    {decryptedCells.length > 0 ? decryptedCells.join(', ') : 'None'}
                  </p>
                </div>
              )}
            </div>

            {statusMessage && <p className="status-message">{statusMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </footer>
        </section>
      </main>
    </div>
  );
}
