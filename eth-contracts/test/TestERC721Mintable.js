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

    it("can get name and symbol", async function () {
      const name = await this.contract.name({ from: account_one });
      const symbol = await this.contract.symbol({ from: account_one });
      console.log(name, symbol);
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
      assert.equal(
        uri,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
        "tokenURI should equal baseUrl + id"
      );
    });

    it("should transfer token from one owner to another", async function () {
      await this.contract.transferFrom(account_two, account_one, 1, {
        from: account_two,
      });
      const owner = await this.contract.ownerOf(1, { from: account_one });
      assert.equal(owner, account_one);
    });

    it("can approve another address to transfer the given token ID", async function () {
      const ownerBefore = await this.contract.ownerOf(2, { from: account_one });
      assert.equal(ownerBefore, account_two);
      const result = await this.contract.approve(account_one, 2, {
        from: account_two,
      });
      assert.equal(
        result.logs[0].event,
        "Approval",
        "should emit Approval event"
      );
      await this.contract.transferFrom(account_two, account_one, 2, {
        from: account_one,
      });
      const owner = await this.contract.ownerOf(2, { from: account_one });
      assert.equal(owner, account_one);
    });

    it("return token approval if it exists", async function () {
      let revertTransaction = false;
      try {
        await this.contract.getApproved(3, {
          from: account_one,
        });
      } catch (err) {
        revertTransaction = true;
      }
      assert.equal(revertTransaction, true, "transaction should be reverted");
      const result = await this.contract.approve(account_one, 2, {
        from: account_two,
      });
      assert.equal(
        result.logs[0].event,
        "Approval",
        "should emit Approval event"
      );

      const address = await this.contract.getApproved(2, {
        from: account_one,
      });

      assert.equal(address, account_one);
    });

    it("can not mint already exists toekn", async function () {
      let reverteTransaction = false;
      try {
        await this.contract.mint(account_two, 2, { from: account_one });
      } catch (err) {
        reverteTransaction = true;
      }
      assert.equal(reverteTransaction, true, "transaction should be reverted");
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let revertTransaction = false;
      try {
        await this.contract.mint(account_two, tokenIds[0], {
          from: account_two,
        });
      } catch (err) {
        revertTransaction = true;
      }

      assert.equal(revertTransaction, true, "transaction must be reverted");
    });

    it("should return contract owner", async function () {
      const owner = await this.contract.owner();
      assert.equal(
        owner,
        account_one,
        "account_one should be owner of contract"
      );
    });

    it("can transfer contract owner", async function () {
      const owner = await this.contract.owner();
      assert.equal(
        owner,
        account_one,
        "account_one should be owner of contract"
      );
      await this.contract.transferOwnership(account_two, { from: account_one });
      const ownerAfter = await this.contract.owner();
      assert.equal(
        ownerAfter,
        account_two,
        "contract owner should change to account_two"
      );

      await this.contract.transferOwnership(account_one, {
        from: account_two,
      });

      const transferBack = await this.contract.owner();
      assert.equal(
        transferBack,
        account_one,
        "contract owner should change to account_one"
      );
    });
  });

  describe("pausable", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
      await this.contract.mint(account_two, tokenIds[0], {
        from: account_one,
      });
      await this.contract.mint(account_two, tokenIds[1], {
        from: account_one,
      });
    });

    it("can pause contract", async function () {
      await this.contract.transferFrom(account_two, account_one, 1, {
        from: account_two,
      });
      const ownerBefore = await this.contract.ownerOf(1, { from: account_one });
      assert.equal(ownerBefore, account_one);

      await this.contract.setPause(true, { from: account_one });
      let revertTransaction = false;
      try {
        await this.contract.transferFrom(account_one, account_two, 1, {
          from: account_one,
        });
      } catch (err) {
        revertTransaction = true;
      }

      assert.equal(
        revertTransaction,
        true,
        "transaction should be reverted, when contract has been paused"
      );
    });
  });
});
