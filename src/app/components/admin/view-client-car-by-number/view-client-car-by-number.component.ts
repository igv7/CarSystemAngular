import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ValidationRules } from 'src/app/validation/rules';

@Component({
  selector: 'app-view-client-car-by-number',
  templateUrl: './view-client-car-by-number.component.html',
  styleUrls: ['./view-client-car-by-number.component.css']
})
export class ViewClientCarByNumberComponent implements OnInit {

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Form model for the license plate; filled with the loaded car. */
  public car = new Car();
  /** Form model for the client id. */
  public client = new Client();

  private log = this.logger.for('ViewClientCarByNumberComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle(PageTitles.VIEW_CLIENT_CAR_BY_NUMBER);
  }

  /** Loads the given client's rented car with this license plate number and shows its details below. */
  public getClientCarByNumber(id: number, number: string):void {
    this.adminService.getClientCarByNumber(id, number).subscribe(car => {
      this.log.debug(`Success! `,
        this.car.id = car.id, 
        this.car.number = car.number,
        this.car.color = car.color,
        this.car.type = car.type,
        this.car.amount = car.amount, 
        this.car.price = car.price, 
        this.car.image = car.image);
      this.router.navigate([AppRoutes.ADMIN_VIEW_CLIENT_CAR_BY_NUMBER, RoutePaths.CAR_ID, this.car.id]);
    }, err => {
      this.log.error(`Failed on get Client Car by number: `, this.car.number, err);
      alert(`Error on view Client Car by number! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. This Client has no car number: ${this.car.number}` + `\n` + 
      `4. Wrong Client ID: ${this.client.id}`);
    });
  }

  /** Cancel button: leaves the form and returns to /admin. */
  public cancel() {
    this.router.navigate([AppRoutes.ADMIN])
    this.title.setTitle(PageTitles.ADMIN);
  }

  /** Close (×) button: leaves the form and returns to /admin. */
  public close() {
    this.router.navigate([AppRoutes.ADMIN])
    this.title.setTitle(PageTitles.ADMIN);
  }

}
