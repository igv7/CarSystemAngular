import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt-details.component.html',
  styleUrls: ['./receipt-details.component.css']
})
export class ReceiptDetailsComponent implements OnInit {

  public clientReceipt: ClientReceipt;

  public constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.adminService.getAllReceipts().subscribe((clientReceipts) => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.clientReceipt = clientReceipts.find(cr => cr.receiptId == id);
      console.log(`Success on get Receipt details! `);
    }, err => {
      console.log(`Failed on get Receipt details! ` + `\n` +err.message);
      alert(`Error on get Receipt details! ` + `\n` +err.message);
    });
  }

  public backToAllReceipts(): void {
    this.router.navigate(["/admin/view-all-receipts"]);
  }

  public backToReceiptsByClient() {
    this.router.navigate(["/admin/view-receipts-by-client"]);
  }

}
