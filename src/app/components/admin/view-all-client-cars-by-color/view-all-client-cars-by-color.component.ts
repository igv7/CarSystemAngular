import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ValidationRules } from 'src/app/validation/rules';
import { CAR_COLORS } from 'src/app/models/car-color';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-view-all-client-cars-by-color',
  templateUrl: './view-all-client-cars-by-color.component.html',
  styleUrls: ['./view-all-client-cars-by-color.component.css']
})
export class ViewAllClientCarsByColorComponent implements OnInit {

  /** Color options for the template. */
  public readonly carColors = CAR_COLORS;

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  /** Form model; `color` holds the selected color. */
  public car = new Car();
  /** Form model; `id` holds the client to look up. */
  public client = new Client();

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ViewAllClientCarsByColorComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle(PageTitles.ALL_CLIENT_CARS_BY_COLOR);
  }

  /** Loads the given client's rented cars of the selected color into the table. */
  public getAllClientCarsByColor(id: number, color: string): void {
    this.adminService.getAllClientCarsByColor(id, color).subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      this.message = cars.length ? null : Messages.clientHasNoCarsOfColor(id, color);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Client Cars By Color! `, err);
      this.cars = null;
      this.message = loadErrorMessage(err, Messages.wrongClientId(id));
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

  /** Reset button: clears the form, the cars table and the message, and closes details opened from here. */
  public reset(): void {
    this.client = new Client();
    this.car = new Car();
    this.cars = null;
    this.message = null;
    this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_CLIENT_CARS_BY_COLOR]);
  }

}
