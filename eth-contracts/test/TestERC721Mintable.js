const ERC721MintableComplete = artifacts.require("CustomERC721Token");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const tokenIds = [1, 2];

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });

      // TODO: mint multiple tokens

      await this.contract.mint(account_two, tokenIds[0], {
        from: account_one,
      });
      await this.contract.mint(account_two, tokenIds[1], {
        from: account_one,
      });
    });

    it("should return total supply", async function () {
      const result = await this.contract.totalSupply({ from: account_one });
      assert.equal(
        result,
        tokenIds.length,
        "totle supply should be equal total mint()"
      );
    });

    it("should get token balance", async function () {
      const balance = await this.contract.balanceOf(account_two, {
        from: account_two,
      });

      assert.equal(balance, tokenIds.length);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      const uri = await this.contract.tokenURI(tokenIds[0], {
        from: account_two,
      });
      console.log(uri);
    });

    it("should transfer token from one owner to another", async function () {});
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {});

    it("should return contract owner", async function () {});
  });
});
