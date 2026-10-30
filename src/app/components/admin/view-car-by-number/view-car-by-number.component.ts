import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ValidationRules } from 'src/app/validation/rules';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-view-car-by-number',
  templateUrl: './view-car-by-number.component.html',
  styleUrls: ['./view-car-by-number.component.css']
})
export class ViewCarByNumberComponent implements OnInit {

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Form model for the license plate lookup; filled with the loaded car. */
  public car = new Car();

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ViewCarByNumberComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle(PageTitles.VIEW_CAR_BY_NUMBER);
  }

  /** Loads the car with the entered license plate number and shows its details below. */
  public getCarByNumber():void {
    this.adminService.getCarByNumber(this.car.number).subscribe(car => {
      this.log.debug(`Success! `,
        this.car.id = car.id, 
        this.car.number = car.number,
        this.car.color = car.color,
        this.car.type = car.type,
        this.car.amount = car.amount, 
        this.car.price = car.price, 
        this.car.image = car.image);
      this.message = null;
      this.router.navigate([AppRoutes.ADMIN_VIEW_CAR_BY_NUMBER, RoutePaths.CAR_ID, this.car.id]);
    }, err => {
      this.log.error(`Failed on get Car by number: `, this.car.number, err);
      this.message = loadErrorMessage(err, Messages.wrongCarNumber(this.car.number));
      // Close the details of a car or client looked up before.
      this.router.navigate([AppRoutes.ADMIN_VIEW_CAR_BY_NUMBER]);
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

  /** Reset button: clears the form, the car shown below the form and the message, and closes details opened from here. */
  public reset(): void {
    this.car = new Car();
    this.message = null;
    this.router.navigate([AppRoutes.ADMIN_VIEW_CAR_BY_NUMBER]);
  }

}
