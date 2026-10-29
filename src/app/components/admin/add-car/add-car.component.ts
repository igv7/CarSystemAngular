import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { serverErrorMessage } from 'src/app/validation/sanitize';
import { AppRoutes } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ValidationRules } from 'src/app/validation/rules';
import { CAR_COLORS } from 'src/app/models/car-color';
import { CAR_TYPES } from 'src/app/models/car-type';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {

  /** Color options for the template. */
  public readonly carColors = CAR_COLORS;
  /** Brand options for the template. */
  public readonly carTypes = CAR_TYPES;

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Form model; the inputs bind to it. */
  public car = new Car();

  private log = this.logger.for('AddCarComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle(PageTitles.ADD_CAR);
  }

  /** Adds the car and opens the car list. The template only calls this once the form is valid. */
  public addCar(): void {
    this.adminService.addCar(this.car).subscribe(car => {
      this.log.info(`Success on add Car! `,this.car = car);
      this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_CARS])
    }, err => {
      this.log.error(`Failed on add Car! `, this.car.number, err);
      const message = serverErrorMessage(err);
      alert(message ? `Error on add Car!` + `\n\n` + message : `Error on add Car! ` + `\n` + `The reasons: ` + `\n` +
      `1. No internet connection` + `\n` +
      `2. No connection to the server` + `\n` +
      `3. This Car number: ${this.car.number} already exists in the system!`);
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
