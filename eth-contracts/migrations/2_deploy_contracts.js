// migrating the appropriate contracts
// var SquareVerifier = artifacts.require("SquareVerifier");
// var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

// for test
const CustomERC721Token = artifacts.require("CustomERC721Token");

module.exports = function (deployer) {
  // deployer.deploy(SquareVerifier);
  // deployer.deploy(SolnSquareVerifier);
  deployer.deploy(CustomERC721Token);
};
