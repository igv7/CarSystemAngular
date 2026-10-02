import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-details-receipt',
  templateUrl: './details-receipt.component.html',
  styleUrls: ['./details-receipt.component.css']
})
export class DetailsReceiptComponent implements OnInit {

  /** The receipt picked by the id in the URL. */
  public clientReceipt: ClientReceipt;

  private log = this.logger.for('DetailsReceiptComponent');

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private clientService: ClientService, private router: Router, private logger: LoggerService) { }

  /** Loads the client's receipts and shows the one whose id is in the URL. */
  public ngOnInit(): void {
    this.clientService.getMyReceipts().subscribe((clientReceipts) => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.clientReceipt = clientReceipts.find(cr => cr.receiptId == id);
      this.log.debug(`Success on get Receipt details! `);
    }, err => {
      this.log.error(`Failed on get Receipt details! `, err);
      alert(`Error on view Receipt details! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
    this.title.setTitle("Receipt Details");
  }

  /** Returns to /client/view-my-receipts. */
  public backToMyReceipts(): void {
    this.router.navigate(["/client/view-my-receipts"]);
    this.title.setTitle("My Receipts");
  }

}
