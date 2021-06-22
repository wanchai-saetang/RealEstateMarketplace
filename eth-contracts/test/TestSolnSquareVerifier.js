const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("Verifier");

contract("Verifier", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const proof = require("../../zokrates/code/square/proof.json");

  describe("ZK and ERC721 integration", async function () {
    beforeEach(async function () {
      this.verifierContract = await Verifier.new({ from: account_one });
      this.contract = await SolnSquareVerifier.new(
        this.verifierContract.address,
        { from: account_one }
      );
    });

    it("can get name and symbol", async function () {
      const symbol = await this.contract.symbol();
      const name = await this.contract.name();
      console.log(symbol, name);
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it("can add new solution", async function () {
      const result = await this.contract.addSolution(
        account_two,
        1,
        proof.proof.a,
        proof.proof.b,
        proof.proof.c,
        proof.inputs,
        { from: account_one }
      );
      assert.equal(
        result.logs[0].event,
        "SolutionAdded",
        "event should be emitted"
      );
      const solution = await this.contract.getSolution(0, {
        from: account_one,
      });
      assert.equal(solution[1], account_two, "address must equal account_two");
      assert.equal(solution[2], true, "solution must be added");
    });
    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it("can mint ERC721 token", async function () {
      await this.contract.mintNewNFT(
        account_two,
        2,
        proof.proof.a,
        proof.proof.b,
        proof.proof.c,
        proof.inputs,
        { from: account_one }
      );
      const owner = await this.contract.ownerOf(2, { from: account_one });
      assert.equal(owner, account_two, "token must be minted");
    });
  });
});
