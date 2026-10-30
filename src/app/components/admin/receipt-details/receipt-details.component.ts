import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, ID_PARAM } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt-details.component.html',
  styleUrls: ['./receipt-details.component.css']
})
export class ReceiptDetailsComponent implements OnInit {

  /** The receipt picked by the id in the URL. */
  public clientReceipt: ClientReceipt;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ReceiptDetailsComponent');

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Loads all receipts and shows the one whose id is in the URL. */
  public ngOnInit(): void {
    this.adminService.getAllReceipts().subscribe((clientReceipts) => {
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

  /** Returns to /admin/view-all-receipts. */
  public backToAllReceipts(): void {
    this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_RECEIPTS]);
    this.title.setTitle(PageTitles.ALL_RECEIPTS);
  }

  /** Returns to /admin/view-receipts-by-client. */
  public backToReceiptsByClient() {
    this.router.navigate([AppRoutes.ADMIN_VIEW_RECEIPTS_BY_CLIENT]);
    this.title.setTitle(PageTitles.RECEIPTS_BY_CLIENT);
  }

}
