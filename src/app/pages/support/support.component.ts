import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Title } from '@angular/platform-browser';
import Web3 from 'web3/dist/web3.min.js'
declare let window:any;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})

export class SupportComponent {
  address = '0xa119a6F239fEF7b429Fd89C43f0BF227C5C831Cb'
  fromAddress;
  web3 = new Web3(window.ethereum);
  customAmount;
  message;
  error;
  success;
  messageSuccess;
  constructor(private http: HttpClient, public analytics: AngularFireAnalytics, public titleService: Title,) {

  }
  
  ngOnInit() {
    this.titleService.setTitle("Catgirl Stats | Support")
    this.analytics.logEvent('go_to_support');
    this.getAccount()
  }

  async connectWallet() {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
        this.analytics.logEvent('connected_wallet');
        this.error = "";
        this.getAccount()
      });
    }
  }

  async getAccount() {
    await this.web3.eth.getAccounts().then(x => this.fromAddress = x[0]);
  }

  sendTransaction(value) {
    this.analytics.logEvent('send_transation', {value: value});
    if (!this.fromAddress) {
      return this.error = "Please connect wallet to continue!"
    }
    var converted = this.web3.utils.toWei(value);
    this.web3.eth.sendTransaction({from: this.fromAddress, to: this.address, value: converted}, () => this.success = "Thank you so much <333")
  }

  submitMessage() {
    this.http.post("https://catgirlstats.dev/Support/SendMessage", {message: this.message}).subscribe(x => {
      this.messageSuccess = "Your message will show once approved!"
    })
  }

  ngOnDestroy() {

  }
}
