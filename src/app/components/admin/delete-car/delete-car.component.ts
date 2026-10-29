import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ValidationRules } from 'src/app/validation/rules';

@Component({
  selector: 'app-delete-car',
  templateUrl: './delete-car.component.html',
  styleUrls: ['./delete-car.component.css']
})
export class DeleteCarComponent implements OnInit {

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Form model for the id lookup; filled with the loaded car. */
  public car = new Car();

  private log = this.logger.for('DeleteCarComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
   this.title.setTitle(PageTitles.DELETE_CAR);
  }

  /** Loads the car with the entered id and shows its details below, so it can be checked before deleting. */
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
      this.router.navigate([AppRoutes.ADMIN_DELETE_CAR, RoutePaths.CAR_ID, this.car.id]);
    }, err => {
      this.log.error(`Failed on get Car! Wrong ID: `, this.car.id, err);
      alert(`Error on view Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.car.id}`);
    });
  }

  /** After confirmation, deletes the car and opens the car list. */
  public deleteCar(): void {
    if(confirm(`Are You sure You want to remove this Car? ` + `\n` + `Car ID: ${this.car.id}`)) {
      this.adminService.deleteCar(this.car.id).subscribe((c) => {
      this.log.info(`Success on delete Car Id: `,this.car.id = c.id);
        alert(`Car Id: ${c.id} Number: `+c.number+ ` has been succesfully deleted!`);
        this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_CARS]);
    }, err => {
      this.log.error(`Failed on delete Car! Wrong ID: `, this.car.id, err);
      alert(`Error on delele Car! ` + `\n` + `The reasons: ` + `\n` + 
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

}
