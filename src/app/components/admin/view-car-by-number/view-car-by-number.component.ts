import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-view-car-by-number',
  templateUrl: './view-car-by-number.component.html',
  styleUrls: ['./view-car-by-number.component.css']
})
export class ViewCarByNumberComponent implements OnInit {

  /** Form model for the license plate lookup; filled with the loaded car. */
  public car = new Car();

  private log = this.logger.for('ViewCarByNumberComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle("View Car By Number");
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
      this.router.navigate(["/admin/view-car-by-number/car-id/"+this.car.id]);
    }, err => {
      this.log.error(`Failed on get Car by number: `, this.car.number, err);
      alert(`Error on view Car by number! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Car by number: ${this.car.number}`);
    });
  }

  /** Cancel button: leaves the form and returns to /admin. */
  public cancel() {
    this.router.navigate(["/admin"])
    this.title.setTitle("Admin Page");
  }

  /** Close (×) button: leaves the form and returns to /admin. */
  public close() {
    this.router.navigate(["/admin"])
    this.title.setTitle("Admin Page");
  }

}
