import { Component } from '@angular/core';
import { nftadeContextService } from './services/nftrade-context.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(private nftContext: nftadeContextService) {}
}
