import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {

  public car = new Car();

  public constructor(private title: Title, private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.title.setTitle("Add car");
  }

  public addCar(): void {
    if (!this.car.number || !this.car.color || !this.car.type || !this.car.amount || !this.car.price || !this.car.image) {
      this.router.navigate(["/admin/add-car"])
      this.adminService.addCar(this.car).subscribe(car => {}, err => {
        console.log(`Failed on add Car! `,this.car.number + `\n` +err.message);
        alert(`Error on add Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
      })
    } else {
    this.adminService.addCar(this.car).subscribe(car => {
      console.log(`Success on add Car! `,this.car = car);
      this.router.navigate(["/admin/view-all-cars"])
    }, err => {
      console.log(`Failed on add Car! `,this.car.number + `\n` +err.message);
      alert(`Error on add Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. This Car number: ${this.car.number} already exists in the system!`);
    });
   }
  }



  public cancel() {
    this.router.navigate(["/admin"])
  }

  public close() {
    this.router.navigate(["/admin"])
  }

}
