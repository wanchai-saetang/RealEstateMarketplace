// migrating the appropriate contracts
// var SquareVerifier = artifacts.require("SquareVerifier");
// var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

const SquareVerifier = artifacts.require("Verifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = async function (deployer) {
  await deployer.deploy(SquareVerifier);
  await deployer.deploy(SolnSquareVerifier, SquareVerifier.address);
};
