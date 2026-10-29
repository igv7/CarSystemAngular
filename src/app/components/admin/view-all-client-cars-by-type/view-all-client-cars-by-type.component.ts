import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ValidationRules } from 'src/app/validation/rules';
import { CAR_TYPES } from 'src/app/models/car-type';

@Component({
  selector: 'app-view-all-client-cars-by-type',
  templateUrl: './view-all-client-cars-by-type.component.html',
  styleUrls: ['./view-all-client-cars-by-type.component.css']
})
export class ViewAllClientCarsByTypeComponent implements OnInit {

  /** Brand options for the template. */
  public readonly carTypes = CAR_TYPES;

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  /** Form model; `type` holds the selected brand. */
  public car = new Car();
  /** Form model; `id` holds the client to look up. */
  public client = new Client();

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  private log = this.logger.for('ViewAllClientCarsByTypeComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle(PageTitles.ALL_CLIENT_CARS_BY_TYPE);
  }

  /** Loads the given client's rented cars of the selected brand into the table. */
  public getAllClientCarsByType(id: number, type: string): void {
    this.adminService.getAllClientCarsByType(id, type).subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Client Cars By Type! `, err);
      alert(`Error on view all Client Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. This Client has no cars` + `\n` + 
      `4. No Client Cars by type ${this.car.type}` + `\n` + 
      `5. Wrong Client ID: ${this.client.id}`);
    });
  }

  /** Returns to /admin. */
  public backToAdmin(): void {
    this.router.navigate([AppRoutes.ADMIN]);
    this.title.setTitle(PageTitles.ADMIN);
  }

  /** Shows or hides the car pictures in the table. */
  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
