import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { LoggerService } from 'src/app/services/logger.service';

/** Client details shown under the admin client lookups (`client-id/:id`): view, update, delete. */
@Component({
  selector: 'app-client-id',
  templateUrl: './client-id.component.html',
  styleUrls: ['./client-id.component.css']
})
export class ClientIdComponent implements OnInit {

  /** The client picked by the id in the URL. */
  public client: Client;

  private log = this.logger.for('ClientIdComponent');

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService, private logger: LoggerService) { }

  /** Loads all clients and shows the one whose id is in the URL. */
  public ngOnInit(): void {
    this.adminService.getAllClients().subscribe(clients => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.client = clients.find(c => c.id == id);
      this.log.debug(`Success! `);
    }, err => {
      this.log.error(`Failed! `, err);
      alert(`Error! ` + `\n` +err.message);
    });
    
  }

}
