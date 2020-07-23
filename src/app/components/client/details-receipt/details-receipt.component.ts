import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-details-receipt',
  templateUrl: './details-receipt.component.html',
  styleUrls: ['./details-receipt.component.css']
})
export class DetailsReceiptComponent implements OnInit {

  public clientReceipt: ClientReceipt;

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getMyReceipts().subscribe((clientReceipts) => {
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

  public backToMyReceipts(): void {
    this.router.navigate(["/client/view-my-receipts"]);
    this.title.setTitle("My Receipts");
  }

}
