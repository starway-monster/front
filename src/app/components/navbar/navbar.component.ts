import { WalletInteractionService } from './../../shared/services/wallet-interaction.service';
import {Component} from '@angular/core';

@Component({
  selector: 'sm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{

  public address$ = this.walletInteractionService.walletAddress$;

  constructor(private readonly walletInteractionService: WalletInteractionService) {
  }

  async onConnectWallet() {
    await this.walletInteractionService.connectWallet();
  }
}
