import TronWeb from "tronweb";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import {
  approveKey,
  approveRouter,
  approveTerminal,
  deployVault,
  sendTransaction,
} from "./blockchain";

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  headers: { "TRON-PRO-API-KEY": "0ccb5071-3c4a-44a1-97ca-6742f4339010" },
  privateKey: import.meta.env.VITE_PRIVATE_KEY,
});

function App() {
  const [cardDetails, setCardDetails] = useState<[string, string]>();
  const [hash, setHash] = useState();
  const [loading, setLoading] = useState(false);

  async function listen() {
    const socket = new WebSocket("ws://localhost:4000/");
    socket.onopen = function () {
      console.log("[open] Connection established");
    };
    socket.onmessage = function (event) {
      const { privateKey, ownerAddress } = JSON.parse(event.data);
      console.log("client received", privateKey, ownerAddress);
      setCardDetails([privateKey, ownerAddress]);
    };
  }

  useEffect(() => {
    listen();
  }, []);

  return (
    <div className="flex min-h-screen w-full justify-center items-center bg-gradient-to-r from-red-700 to-black gap-4">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body justify-center">
          <h1 className="text-3xl font-bold">Bounce.</h1>
          <div className="inline-flex gap-1">
            <button
              className="btn btn-sm"
              onClick={() => {
                // TODO: finish off
                setLoading(false);
                setCardDetails(undefined);
                setHash(undefined);
              }}
            >
              clear
            </button>
          </div>
          <p className="text-sm">Paying 10 USDC and swapping to USDT</p>
          {cardDetails ? (
            <p className="text-sm truncate">Owner: {cardDetails[1]}</p>
          ) : (
            <p className="text-sm">Waiting to scan card:</p>
          )}
          <div className="divider my-0"></div>
          {hash && <p className="text-sm truncate">hash: {hash}</p>}
          {loading ? (
            <span className="loading loading-spinner loading-md self-center"></span>
          ) : (
            <>
              <button
                className="btn btn-sm"
                onClick={async () => {
                  setLoading(true);
                  const hash = await sendTransaction(tronWeb);
                  setLoading(false);
                  setHash(hash);
                }}
              >
                send
              </button>
              {/* <button
                className="btn btn-sm"
                onClick={async () => {
                  setLoading(true);
                  const hash = await approveRouter(tronWeb);
                  setLoading(false);
                  setHash(hash);
                }}
              >
                Approve Router
              </button> */}
              <button
                className="btn btn-sm"
                onClick={async () => {
                  setLoading(true);
                  const hash = await approveKey(tronWeb);
                  setHash(hash);
                  setLoading(false);
                }}
              >
                Reset Card address
              </button>
              {/* <button
                className="btn btn-sm"
                onClick={async () => {
                  setLoading(true);
                  const hash = await approveTerminal(tronWeb);
                  setHash(hash);
                  setLoading(false);
                }}
              >
                Approve Terminal
              </button> */}
              {/* <button
                className="btn btn-sm"
                onClick={async () => {
                  setLoading(true);
                  const hash = await deployVault(tronWeb);
                  setHash(hash);
                  setLoading(false);
                }}
              >
                Deploy Vault
              </button> */}
            </>
          )}
        </div>
      </div>
      {hash && (
        <div className="card bg-base-100 shadow-xl">
          {hash && (
            <div className="card-body">
              <QRCode
                size={50}
                style={{ height: "auto", maxWidth: 100, width: 100 }}
                value={"https://tronscan.org/#/transaction/" + hash} // TODO: add code
                viewBox={`0 0 256 256`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
