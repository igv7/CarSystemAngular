import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrls: ['./update-car.component.css']
})
export class UpdateCarComponent implements OnInit {

  public car = new Car();

  private log = this.logger.for('UpdateCarComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  public ngOnInit():void {
    this.title.setTitle("Update Car");
  }

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
      this.router.navigate(["/admin/update-car/car-id/"+this.car.id]);
    }, err => {
      this.log.error(`Failed on get Car ID: `, this.car.id, err);
      alert(`Error on view Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.car.id}`);
    });
  }

  public updateCar(): void {
    this.adminService.updateCar(this.car).subscribe(car => {
      this.log.info(`Success on update Car! `,this.car = car);
      alert(`Car ID: ${this.car.id} has been succesfully updated!`);
      this.router.navigate(["/admin/view-all-cars"])
    }, err => {
      this.log.error(`Failed on update Car! `, this.car.id, err);
      alert(`Error on update Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.car.id}`);
    });
  }



  public cancel() {
    this.router.navigate(["/admin"])
    this.title.setTitle("Admin Page");
  }

  public close() {
    this.router.navigate(["/admin"])
    this.title.setTitle("Admin Page");
  }

}
