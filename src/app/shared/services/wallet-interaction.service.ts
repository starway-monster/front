import { TransferResultDialogComponent } from './../../components/transfer-result-dialog/transfer-result-dialog.component';
import { IPath } from './../../api/models/zone.model';
import { Injectable } from '@angular/core';
import { ITransferDetailsData, TransferDialogComponent } from 'src/app/components/transfer-dialog/transfer-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MsgTransfer } from 'src/app/components/module/types/ibc/applications/transfer/v1/tx';
import { txClient } from 'src/app/components/module';
import { isBroadcastTxFailure, isBroadcastTxSuccess } from '@cosmjs/stargate';
import { BehaviorSubject } from 'rxjs';

export interface IZoneDetailsData {
  chainId: string;
  endpoint: string;
  denom: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletInteractionService {

  public chainsData: {[zoneName: string]: IZoneDetailsData} = {
    'musselnet-4': { chainId: 'musselnet-4', denom: 'umayo', endpoint: 'https://rpc.musselnet.cosmwasm.com'  }
  };

  public walletSigners: {[chainId: string]: { offlineSigner } } = {};

  private walletAddressSubj = new BehaviorSubject<string>('');
  public walletAddress$ = this.walletAddressSubj.asObservable();

  constructor(private readonly dialog: MatDialog) { }

  public async connectWallet() {
    if (!(window as any).getOfflineSigner || !(window as any).keplr) {
      alert('Please install keplr extension');
    } else {
      // Enabling before using the Keplr is recommended.
      // This method will ask the user whether or not to allow access if they haven't visited this website.
      // Also, it will request user to unlock the wallet if the wallet is locked.
      const chainId = this.chainsData['musselnet-4'].chainId
      await (window as any).keplr.enable(chainId);
      const offlineSigner = (window as any).getOfflineSigner(chainId);
      this.walletSigners[chainId] = { offlineSigner };
      const accounts = await offlineSigner.getAccounts();
      this.walletAddressSubj.next(accounts[0].address)
    }
  }

  public async openDialog(path: IPath) {
    const detailsData = this.chainsData[path.fromZone];
    const offlineSigner = this.walletSigners[detailsData.chainId].offlineSigner;
    const accounts = await offlineSigner.getAccounts();
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      width: '500px',
      data: {
        fromZone: path.fromZone,
        toZone: path.toZone,
        sourcePort: 'transfer',
        sourceChannel: path?.channels?.length > 0 ? path.channels[0] : undefined,
        denom: detailsData.denom,
        sender: accounts[0].address,
        receiver: 'tcro1n0d8n44jyrvmymuqmyrnp0zm9fx8esmvzf8qwx',
        amount: 1,
        channels: path.channels
      }
    });

    const transferDetails = await dialogRef.afterClosed().toPromise();
    if (!!transferDetails) {
      await this.executeTransfer(transferDetails)
    }
  }

  async executeTransfer(details: ITransferDetailsData) {
    const chainDetails = this.chainsData[details.fromZone];
    const offlineSigner = this.walletSigners[chainDetails.chainId].offlineSigner;

    const txc = await txClient(chainDetails.endpoint, offlineSigner, details.sender);
    const msgTransferData = MsgTransfer.fromJSON({
      sourcePort: details.sourcePort,
      sourceChannel: details.sourceChannel,
      token: {
        denom: chainDetails.denom,
        amount: details.amount,
      },
      sender: details.sender,
      receiver: details.receiver,
      timeoutTimestamp: Date.now() * 1000000
    });

    const an_encoded_transfer_message = txc.msgTransfer(msgTransferData);
    const result_of_broadcast = await txc.signAndBroadcast([an_encoded_transfer_message]);

    const dialogRef = this.dialog.open(TransferResultDialogComponent, {
      width: '675px',
      data: {
        isSuccess: isBroadcastTxSuccess(result_of_broadcast),
        errorCode: isBroadcastTxFailure(result_of_broadcast) ? result_of_broadcast.code : undefined,
        transactionHash: result_of_broadcast.transactionHash
      }
    });
    await dialogRef.afterClosed().toPromise();
  }
}
