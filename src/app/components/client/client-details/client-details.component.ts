import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, ID_PARAM } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

/** Client details shown under the admin's client list (`client-details/:id`). */
@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  /** The client picked by the id in the URL. */
  public client: Client;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ClientDetailsComponent');

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Loads all clients and shows the one whose id is in the URL. */
  public ngOnInit(): void {
    this.adminService.getAllClients().subscribe((clients) => {
      const id = +this.activatedRoute.snapshot.params[ID_PARAM];
      this.client = clients.find(c => c.id == id);
      this.message = this.client ? null : Messages.wrongClientId(id);
      this.log.debug(`Success on get Client details! `);
    }, err => {
      this.log.error(`Failed on get Client details! `, err);
      this.message = loadErrorMessage(err);
    });
    this.title.setTitle(PageTitles.CLIENT_DETAILS);
  }

  /** Returns to /admin/view-all-clients. */
  public backToAllClients(): void {
    this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_CLIENTS]);
    this.title.setTitle(PageTitles.ALL_CLIENTS);
  }

}
