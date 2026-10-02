import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {

  public car = new Car();

  private log = this.logger.for('AddCarComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  public ngOnInit(): void {
    this.title.setTitle("Add car");
  }

  public addCar(): void {
    if (!this.car.number || !this.car.color || !this.car.type || !this.car.amount || !this.car.price || !this.car.image) {
      this.router.navigate(["/admin/add-car"])
      this.adminService.addCar(this.car).subscribe(car => {}, err => {
        this.log.error(`Failed on add Car! `, this.car.number, err);
        alert(`Error on add Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
      })
    } else {
    this.adminService.addCar(this.car).subscribe(car => {
      this.log.info(`Success on add Car! `,this.car = car);
      this.router.navigate(["/admin/view-all-cars"])
    }, err => {
      this.log.error(`Failed on add Car! `, this.car.number, err);
      alert(`Error on add Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. This Car number: ${this.car.number} already exists in the system!`);
    });
   }
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
