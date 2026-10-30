import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { serverErrorMessage } from 'src/app/validation/sanitize';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ValidationRules } from 'src/app/validation/rules';
import { CAR_COLORS } from 'src/app/models/car-color';
import { CAR_TYPES } from 'src/app/models/car-type';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrls: ['./update-car.component.css']
})
export class UpdateCarComponent implements OnInit {

  /** Color options for the template. */
  public readonly carColors = CAR_COLORS;
  /** Brand options for the template. */
  public readonly carTypes = CAR_TYPES;

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Form model: the id is typed in first, then the loaded car fills the rest for editing. */
  public car = new Car();

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('UpdateCarComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle(PageTitles.UPDATE_CAR);
  }

  /** Loads the car with the entered id into the form and shows its details below. */
  public getCar():void {
    this.adminService.getCar(this.car.id).subscribe(car => {
      this.log.debug(`Success! `,
        this.car.id = car.id, 
        this.car.number = car.number,
        this.car.color = car.color,
        this.car.type = car.type,
        this.car.amount = car.amount, 
        this.car.price = car.price, 
        this.car.image = car.image);
      this.message = null;
      this.router.navigate([AppRoutes.ADMIN_UPDATE_CAR, RoutePaths.CAR_ID, this.car.id]);
    }, err => {
      this.log.error(`Failed on get Car ID: `, this.car.id, err);
      this.message = loadErrorMessage(err, Messages.wrongCarId(this.car.id));
      // Close the details of a car or client looked up before.
      this.router.navigate([AppRoutes.ADMIN_UPDATE_CAR]);
    });
  }

  /** Saves the edited car and opens the car list. */
  public updateCar(): void {
    this.adminService.updateCar(this.car).subscribe(car => {
      this.log.info(`Success on update Car! `,this.car = car);
      alert(`Car ID: ${this.car.id} has been succesfully updated!`);
      this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_CARS])
    }, err => {
      this.log.error(`Failed on update Car! `, this.car.id, err);
      const message = serverErrorMessage(err);
      alert(message ? `Error on update Car!` + `\n\n` + message : `Error on update Car! ` + `\n` + `The reasons: ` + `\n` +
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.car.id}`);
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
    this.router.navigate([AppRoutes.ADMIN_UPDATE_CAR]);
  }

}
