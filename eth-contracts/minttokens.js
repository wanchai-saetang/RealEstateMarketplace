import SolnSquareVerifierArtifact from "./build/contracts/SolnSquareVerifier.json";
import proof from "../zokrates/code/square/proof.json";
import Web3 from "web3";

(async function () {
  const web3 = new Web3(Web3.givenProvider);

  const accounts = await web3.eth.getAccounts();
  let currentAccount = accounts[0];

  window.ethereum.on("accountsChanged", (event) => {
    currentAccount = event[0];
  });

  // get contract instance
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = SolnSquareVerifierArtifact.networks[networkId];
  const SolnSquareVerifierContract = new web3.eth.Contract(
    SolnSquareVerifierArtifact.abi,
    deployedNetwork.address
  );

  const tokenIdEl = document.querySelector("#tokenId");
  const addressTo = document.querySelector("#addr");

  document
    .querySelector("#buttonMint")
    .addEventListener("click", async function () {
      console.log(addressTo.value);
      console.log(tokenIdEl.value);
      try {
        await SolnSquareVerifierContract.methods
          //   .mint(addressTo.value, tokenIdEl.value)
          .mintNewNFT(
            addressTo.value,
            tokenIdEl.value,
            proof.proof.a,
            proof.proof.b,
            proof.proof.c,
            proof.inputs
          )
          .send({ from: currentAccount }, (err, res) => {
            console.log(err, res);
          });
      } catch (err) {
        console.log(err);
      }
    });
})();
