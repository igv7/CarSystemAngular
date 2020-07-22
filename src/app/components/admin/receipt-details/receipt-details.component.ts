import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt-details.component.html',
  styleUrls: ['./receipt-details.component.css']
})
export class ReceiptDetailsComponent implements OnInit {

  public clientReceipt: ClientReceipt;

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.adminService.getAllReceipts().subscribe((clientReceipts) => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.clientReceipt = clientReceipts.find(cr => cr.receiptId == id);
      console.log(`Success on get Receipt details! `);
    }, err => {
      console.log(`Failed on get Receipt details! ` + `\n` +err.message);
      alert(`Error on view Receipt details! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
    this.title.setTitle("Receipt Details");
  }

  public backToAllReceipts(): void {
    this.router.navigate(["/admin/view-all-receipts"]);
  }

  public backToReceiptsByClient() {
    this.router.navigate(["/admin/view-receipts-by-client"]);
  }

}
