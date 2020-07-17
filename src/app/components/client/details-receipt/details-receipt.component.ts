import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-details-receipt',
  templateUrl: './details-receipt.component.html',
  styleUrls: ['./details-receipt.component.css']
})
export class DetailsReceiptComponent implements OnInit {

  public clientReceipt: ClientReceipt;

  public constructor(private activatedRoute: ActivatedRoute, private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getMyReceipts().subscribe((clientReceipts) => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.clientReceipt = clientReceipts.find(cr => cr.receiptId == id);
      console.log(`Success on get Receipt details! `);
    }, err => {
      console.log(`Failed on get Receipt details! ` + `\n` +err.message);
      alert(`Error on get Receipt details! ` + `\n` +err.message);
    });
  }

  public backToMyReceipts(): void {
    this.router.navigate(["/client/view-my-receipts"]);
  }

  // public backToAllReceiptsByDate(): void {
  //   this.router.navigate(["/client/view-all-receipts-by-date-until"]);
  // }

}
