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
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-view-all-client-cars-by-price-until',
  templateUrl: './view-all-client-cars-by-price-until.component.html',
  styleUrls: ['./view-all-client-cars-by-price-until.component.css']
})
export class ViewAllClientCarsByPriceUntilComponent implements OnInit {

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  /** Form model; `price` holds the maximum price. */
  public car = new Car();
  /** Form model; `id` holds the client to look up. */
  public client = new Client();

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ViewAllClientCarsByPriceUntilComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle(PageTitles.ALL_CLIENT_CARS_BY_PRICE);
  }

  /** Loads the given client's rented cars priced up to `price` into the table. */
  public getAllClientCarsByPrice(id: number, price: number): void {
    this.adminService.getAllClientCarsByPrice(id, price).subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      this.message = cars.length ? null : Messages.clientHasNoCarsUpTo(id, price);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Client Cars By Price! `, err);
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
    this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_CLIENT_CARS_BY_PRICE_UNTIL]);
  }

}
