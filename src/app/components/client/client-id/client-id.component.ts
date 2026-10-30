import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { LoggerService } from 'src/app/services/logger.service';
import { ID_PARAM } from 'src/app/constants/app-routes';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

/** Client details shown under the admin client lookups (`client-id/:id`): view, update, delete. */
@Component({
  selector: 'app-client-id',
  templateUrl: './client-id.component.html',
  styleUrls: ['./client-id.component.css']
})
export class ClientIdComponent implements OnInit {

  /** The client picked by the id in the URL. */
  public client: Client;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ClientIdComponent');

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService, private logger: LoggerService) { }

  /** Loads all clients and shows the one whose id is in the URL. */
  public ngOnInit(): void {
    this.adminService.getAllClients().subscribe(clients => {
      const id = +this.activatedRoute.snapshot.params[ID_PARAM];
      this.client = clients.find(c => c.id == id);
      this.message = this.client ? null : Messages.wrongClientId(id);
      this.log.debug(`Success! `);
    }, err => {
      this.log.error(`Failed! `, err);
      this.message = loadErrorMessage(err);
    });
    
  }

}
