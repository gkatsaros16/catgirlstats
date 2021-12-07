import { Component } from '@angular/core';
import Web3 from 'web3/dist/web3.min.js'
import detectEthereumProvider from '@metamask/detect-provider';
declare let window:any;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})

export class SupportComponent {
  abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];
  address = '0xa119a6F239fEF7b429Fd89C43f0BF227C5C831Cb'
  fromAddress;
  web3 = new Web3(window.ethereum);
  bnbContract = new this.web3.eth.Contract(this.abi, "0xae13d989dac2f0debff460ac112a837c89baa7cd");
  nonce;
  tx;
  sendingAmount = this.web3.utils.toWei("0.001");

  constructor() {

  }
  
  ngOnInit() {
    if (window.ethereum) {
      window.ethereum.send('eth_requestAccounts');
      //web3 currentProvider.enable();
      this.getAccount();
    }
  }

  async getAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.fromAddress = accounts[0];
    this.nonce = this.web3.eth.getTransactionCount(accounts[0]);
  }

  sendTransaction() {
    // const contract = new window.web3.eth.contract(this.abi, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
    // contract.methods.transfer(this.address, .001, {from: this.fromAddress});
    this.tx = {
      from: this.fromAddress,
      nonce: this.web3.utils.toHex(this.nonce),
      to: this.address,
      value: this.sendingAmount,
      data: this.bnbContract.methods.transfer(this.address, this.fromAddress),
      chainId: '97'
    };

    this.web3.eth.sendTransaction({from: this.fromAddress, to: this.address, value: this.sendingAmount});

    // this.bnbContract.methods.transfer(this.address, this.sendingAmount).send({from: this.fromAddress})
    // .on('transactionHash', function(hash){
    //   console.log(hash);
    // });

    // this.web3.eth.accounts.sign(this.tx, this.address, (err, res) => {
    //   if (err) {
    //     console.log('err',err)
    //   }
    //   else {
    //     console.log('res', res)
    //   }
    //   const raw = res.rawTransaction
    //   this.web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    //     if (err) {
    //       console.log(err)
    //     }
    //     else {
    //       console.log("txHash:", txHash)
    //     }
    //   })
    // })
  }

  ngOnDestroy() {

  }
}
