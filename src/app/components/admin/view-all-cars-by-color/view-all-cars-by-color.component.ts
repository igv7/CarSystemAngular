import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { CAR_COLORS } from 'src/app/models/car-color';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-view-all-cars-by-color',
  templateUrl: './view-all-cars-by-color.component.html',
  styleUrls: ['./view-all-cars-by-color.component.css']
})
export class ViewAllCarsByColorComponent implements OnInit {

  /** Color options for the template. */
  public readonly carColors = CAR_COLORS;

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  /** Form model; `color` holds the selected color. */
  public car = new Car();

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ViewAllCarsByColorComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle(PageTitles.ALL_CARS_BY_COLOR)
  }

  /** Loads the cars of the selected color into the table. */
  public getAllCarsByColor(color: string): void {
    this.adminService.getAllCarsByColor(color).subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      this.message = cars.length ? null : Messages.noCarsOfColor(color);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Cars By Color! `, err);
      this.cars = null;
      this.message = loadErrorMessage(err);
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
    this.car = new Car();
    this.cars = null;
    this.message = null;
    this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_CARS_BY_COLOR]);
  }

}
