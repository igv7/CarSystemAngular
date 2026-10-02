import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-view-all-receipts',
  templateUrl: './view-all-receipts.component.html',
  styleUrls: ['./view-all-receipts.component.css']
})
export class ViewAllReceiptsComponent implements OnInit {

  public clientReceipts: ClientReceipt[];
  public client = new Client();

  listFilter: string = "";

  private log = this.logger.for('ViewAllReceiptsComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  public ngOnInit(): void {
    this.adminService.getAllReceipts().subscribe((clientReceipts) => {
      this.log.debug(`Success! `,this.clientReceipts = clientReceipts);
      setTimeout(() => this.clientReceipts = clientReceipts, 1000);
    }, err => {
      this.log.error(`Failed on get all Receipts! `, err);
      alert(`Error on view all Receipts! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Receipts`);
    });
    this.title.setTitle("All Receipts");
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
    this.title.setTitle("Admin Page");
  }

}
