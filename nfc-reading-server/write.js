const express = require("express");
const app = express();
const port = 4000;
const nfcCard = require("nfccard-tool");
const { NFC } = require("nfc-pcsc");
const expressWs = require("express-ws")(app);
const ethers = require("ethers");

app.get("/nfc", (req, res) => {
  return res.send({ message: "hello world" });
});

app.ws("/", function (ws, req) {
  ws.on("message", function (msg) {
    console.log(msg);
  });
  console.log("socket", req.testing);
});

const nfc = new NFC();

nfc.on("reader", (reader) => {
  console.log(`${reader.reader.name}  device attached`);

  reader.on("card", async (card) => {
    console.log(`card detected`, card);

    writeCard(reader);
  });

  reader.on("card.off", (card) => {
    console.log(`${reader.reader.name}  card removed`, card);
  });

  reader.on("error", (err) => {
    console.log(`${reader.reader.name}  an error occurred`, err);
  });

  reader.on("end", () => {
    console.log(`${reader.reader.name}  device removed`);
  });
});

async function writeCard(reader) {
  try {
    /**
     *  1 - READ HEADER
     *  Read header: we need to verify if we have read and write permissions
     *               and if prepared message length can fit onto the tag.
     */
    const cardHeader = await reader.read(0, 20);

    const tag = nfcCard.parseInfo(cardHeader);

    const wallet = new ethers.Wallet(
      "ff4f55382dc1dad042411e64cf13eafaa051e78c9f343a3ffab8ce2408b74479"
    );
    const vaultAddress = "0x1e117008e1a544bbe12a2d178169136703430190";

    /**
     * 2 - WRITE A NDEF MESSAGE AND ITS RECORDS
     */
    const message = [
      { type: "text", text: wallet.privateKey, language: "en" },
      { type: "text", text: vaultAddress, language: "en" },
    ];

    // Prepare the buffer to write on the card
    const rawDataToWrite = nfcCard.prepareBytesToWrite(message);

    // Write the buffer on the card starting at block 4
    const preparationWrite = await reader.write(4, rawDataToWrite.preparedData);

    // Success !
    if (preparationWrite) {
      console.log("Data have been written successfully.");
    }
  } catch (err) {
    console.error(`error when reading data`, err);
  }
}
