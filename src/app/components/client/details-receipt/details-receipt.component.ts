import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, ID_PARAM } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-details-receipt',
  templateUrl: './details-receipt.component.html',
  styleUrls: ['./details-receipt.component.css']
})
export class DetailsReceiptComponent implements OnInit {

  /** The receipt picked by the id in the URL. */
  public clientReceipt: ClientReceipt;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('DetailsReceiptComponent');

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private clientService: ClientService, private router: Router, private logger: LoggerService) { }

  /** Loads the client's receipts and shows the one whose id is in the URL. */
  public ngOnInit(): void {
    this.clientService.getMyReceipts().subscribe((clientReceipts) => {
      const id = +this.activatedRoute.snapshot.params[ID_PARAM];
      this.clientReceipt = clientReceipts.find(cr => cr.receiptId == id);
      this.message = this.clientReceipt ? null : Messages.wrongReceiptId(id);
      this.log.debug(`Success on get Receipt details! `);
    }, err => {
      this.log.error(`Failed on get Receipt details! `, err);
      this.message = loadErrorMessage(err);
    });
    this.title.setTitle(PageTitles.RECEIPT_DETAILS);
  }

  /** Returns to /client/view-my-receipts. */
  public backToMyReceipts(): void {
    this.router.navigate([AppRoutes.CLIENT_VIEW_MY_RECEIPTS]);
    this.title.setTitle(PageTitles.MY_RECEIPTS);
  }

}
