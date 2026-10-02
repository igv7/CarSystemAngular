import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-return-car',
  templateUrl: './return-car.component.html',
  styleUrls: ['./return-car.component.css']
})
export class ReturnCarComponent implements OnInit {

  public car = new Car();

  private log = this.logger.for('ReturnCarComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  public ngOnInit():void {
    this.title.setTitle("Return Car");
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
      this.router.navigate(["/admin/return-car/car-id/"+this.car.id]);
    }, err => {
      this.log.error(`Failed on get Car! Wrong ID: `, this.car.id, err);
      alert(`Error on view Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.car.id}`);
    });
  }

  public returnCar(): void {
    if(confirm(`Are You sure You want to return this Car? ` + `\n` + `Car ID: ${this.car.id}`)) {
    this.adminService.returnCar(this.car.id).subscribe((c) => {
      this.log.info(`Success on return Car Id: `,this.car.id = c.id);
        alert(`Car Id: ${c.id} Number: `+c.number+ ` has been succesfully returned!`);
        this.router.navigate(["/admin/view-all-cars"]);
    }, err => {
      this.log.error(`Failed on return Car! Wrong ID: `, this.car.id, err);
      alert(`Error on return Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.car.id}`);
    });
   }
  }


  public close(): void {
    this.router.navigate(["/admin"]);
    this.title.setTitle("Admin Page");
  }

  public cancel(): void {
    this.router.navigate(["/admin"]);
    this.title.setTitle("Admin Page");
  }

}
