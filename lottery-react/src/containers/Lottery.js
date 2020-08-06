import React, { Component, createRef } from 'react';
import getWeb3 from "../web3";
import web3Utils from "web3-utils";
import LotteryContract from "../contracts/Lottery.json";

class Lottery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manager: null,
            players: [],
            balance: '',
            waitingMsg: null,
        }
        this.inputElementRef = createRef();
        this.contractInstance = createRef(null);
        this.onEnter = this.onEnter.bind(this);
        this.onChooseWinner = this.onChooseWinner.bind(this);
    }

    componentDidMount() {
        const _self = this;
        (async () => {
            // retrieve web3 object with active connection running on port
            const web3 = await getWeb3();
            //populate all the available accounts from local running blockchain
            const _accounts = await web3.eth.getAccounts();
            //get the network id of running blockchain
            const _networkId = await web3.eth.net.getId();
            //get deployed network based on network id for required contract
            const deployedNetwork = LotteryContract.networks[_networkId];
            //generate contract instance based on contract address, abi, and web2 from deployed network
            const instance = new web3.eth.Contract(
                LotteryContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            this.contractInstance.current = instance;
            const manager = await instance.methods.manager().call();
            const players = await instance.methods.getPlayers().call();
            const balance = await web3.eth.getBalance(instance._address);
            _self.setState({ manager, players, balance });
        })();
    }

    async onEnter(e) {
        e.preventDefault();
        const web3 = await getWeb3();
        const _accounts = await web3.eth.getAccounts();
        this.setState({
            waitingMsg: "Waiting for transaction to complete....."
        })
        await this.contractInstance.current.methods.register().send({
            from: _accounts[0],
            value: web3Utils.toWei(this.inputElementRef.current.value, 'ether')
        });
        this.setState({
            waitingMsg: "You have successfully entered !"
        });
        this.inputElementRef.current.value = "";
        const players = await this.contractInstance.current.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(this.contractInstance.current._address);
        this.setState({ players, balance });
    }

    async onChooseWinner(e) {
        e.preventDefault();
        const web3 = await getWeb3();
        const _accounts = await web3.eth.getAccounts();
        this.setState({
            waitingMsg: "Waiting for transaction to complete....."
        })
        await this.contractInstance.current.methods.chooseWinner().send({
            from: _accounts[0]
        });
        const winner = await this.contractInstance.current.methods.winnerAddress().call();
        const winnerBal = await web3.eth.getBalance(winner);
        this.setState({
            waitingMsg: "The winner of lottery is " + winner + " with total balance is " + web3Utils.fromWei(winnerBal, 'ether') + " ether"
        });
        this.inputElementRef.current.value = "";
    }

    render() {
        const _balance = web3Utils.fromWei(this.state.balance, 'ether');
        return (
            <div className="jumbotron">
                <p>
                    This contract is managed by {this.state.manager}.
                    <br />
                    There are currently {this.state.players.length} people entered, competing to win {_balance} ether !
                </p>
                <hr />
                <form onSubmit={this.onEnter}>
                    <div>
                        <h4>Want to try your luck ?</h4>
                        <label>Amount of ether to enter </label>
                        <input type="text"
                            ref={this.inputElementRef} />
                    </div>
                    <button>Enter</button>
                </form>
                <br />
                <h4>Would you like to pick winner ?</h4>
                <button onClick={this.onChooseWinner}>Choose Winner</button>
                <hr />
                {this.state.waitingMsg &&
                    <h5>{this.state.waitingMsg}</h5>}
            </div>
        )
    }
}

export default Lottery;