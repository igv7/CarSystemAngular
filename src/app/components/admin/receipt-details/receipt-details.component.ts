import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt-details.component.html',
  styleUrls: ['./receipt-details.component.css']
})
export class ReceiptDetailsComponent implements OnInit {

  public clientReceipt: ClientReceipt;

  private log = this.logger.for('ReceiptDetailsComponent');

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  public ngOnInit(): void {
    this.adminService.getAllReceipts().subscribe((clientReceipts) => {
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

  public backToAllReceipts(): void {
    this.router.navigate(["/admin/view-all-receipts"]);
    this.title.setTitle("All Receipts");
  }

  public backToReceiptsByClient() {
    this.router.navigate(["/admin/view-receipts-by-client"]);
    this.title.setTitle("Receipts By Client");
  }

}
