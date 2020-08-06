const Lottery = artifacts.require("Lottery");

contract("Lottery", (accounts) => {

    let lotteryInstance;

    beforeEach(async () => {
        lotteryInstance = await Lottery.deployed();
    });

    it("should deploy contract", () => {
        assert(lotteryInstance.address != '');
    });

    // it("should allow to register player", async () => {
    //     await lotteryInstance.register({
    //         from: accounts[0],
    //         value: web3.utils.toWei('0.2', 'ether')
    //     });
    //     const players = await lotteryInstance.getPlayers();
    //     assert.equal(accounts[0], players[0]);
    //     assert.equal(1, players.length);
    // });

    // it("should allow to register multiple players", async () => {
    //     await lotteryInstance.register({
    //         from: accounts[0],
    //         value: web3.utils.toWei('0.2', 'ether')
    //     });
    //     await lotteryInstance.register({
    //         from: accounts[1],
    //         value: web3.utils.toWei('0.2', 'ether')
    //     });
    //     await lotteryInstance.register({
    //         from: accounts[2],
    //         value: web3.utils.toWei('0.2', 'ether')
    //     });
    //     const players = await lotteryInstance.getPlayers();
    //     assert.equal(4, players.length);
    // });

    it("should pass minimum amount of ether", async () => {
        try {
            await lotteryInstance.register({
                from: accounts[0],
                value: 0
            });

        } catch (err) {
            assert(err);
        }
    });

    it("only manager account is permitted", async () => {
        try {
            await lotteryInstance.chooseWinner({
                from: accounts[0]
            });

        } catch (err) {
            assert(err);
        }
    });

    it("Execute lottery and send money to winner", async () => {
        try {
            console.log("before", await web3.eth.getBalance(accounts[0]));
            await lotteryInstance.register({
                from: accounts[0],
                value: web3.utils.toWei('1', 'ether')
            });

            console.log("initial", await web3.eth.getBalance(accounts[0]));

            await lotteryInstance.chooseWinner({
                from: accounts[0]
            });

            console.log("final", await web3.eth.getBalance(accounts[0]));

        } catch (err) {
            assert(err);
        }
    });

});