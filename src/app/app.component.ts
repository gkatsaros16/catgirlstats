import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { nftadeContextService } from './services/nftrade-context.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  isCopied = false;
  constructor(private nftContext: nftadeContextService, private analytics: AngularFireAnalytics) {}

  copyAddress() {
    this.analytics.logEvent('copied_address')
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = "0xa119a6F239fEF7b429Fd89C43f0BF227C5C831Cb";
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.isCopied = true;
  }
}
