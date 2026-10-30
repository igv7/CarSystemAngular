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
  selector: 'app-return-car',
  templateUrl: './return-car.component.html',
  styleUrls: ['./return-car.component.css']
})
export class ReturnCarComponent implements OnInit {

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Form model for the id lookup; filled with the loaded car. */
  public car = new Car();

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ReturnCarComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle(PageTitles.RETURN_CAR);
  }

  /**
   * Loads the car with the entered id and shows its details below, so it can be checked before returning it.
   */
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
      this.router.navigate([AppRoutes.ADMIN_RETURN_CAR, RoutePaths.CAR_ID, this.car.id]);
    }, err => {
      this.log.error(`Failed on get Car! Wrong ID: `, this.car.id, err);
      this.message = loadErrorMessage(err, Messages.wrongCarId(this.car.id));
      // Close the details of a car or client looked up before.
      this.router.navigate([AppRoutes.ADMIN_RETURN_CAR]);
    });
  }

  /** After confirmation, marks the car as returned and opens the car list. */
  public returnCar(): void {
    if(confirm(`Are You sure You want to return this Car? ` + `\n` + `Car ID: ${this.car.id}`)) {
    this.adminService.returnCar(this.car.id).subscribe((c) => {
      this.log.info(`Success on return Car Id: `,this.car.id = c.id);
        alert(`Car Id: ${c.id} Number: `+c.number+ ` has been succesfully returned!`);
        this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_CARS]);
    }, err => {
      this.log.error(`Failed on return Car! Wrong ID: `, this.car.id, err);
      alert(`Error on return Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.car.id}`);
    });
   }
  }


  /** Close (×) button: leaves the form and returns to /admin. */
  public close(): void {
    this.router.navigate([AppRoutes.ADMIN]);
    this.title.setTitle(PageTitles.ADMIN);
  }

  /** Cancel button: leaves the form and returns to /admin. */
  public cancel(): void {
    this.router.navigate([AppRoutes.ADMIN]);
    this.title.setTitle(PageTitles.ADMIN);
  }

  /** Reset button: clears the form, the car shown below the form and the message, and closes details opened from here. */
  public reset(): void {
    this.car = new Car();
    this.message = null;
    this.router.navigate([AppRoutes.ADMIN_RETURN_CAR]);
  }

}
