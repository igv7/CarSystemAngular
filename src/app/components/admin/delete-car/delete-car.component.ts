import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-delete-car',
  templateUrl: './delete-car.component.html',
  styleUrls: ['./delete-car.component.css']
})
export class DeleteCarComponent implements OnInit {

  public car = new Car();

  public constructor(private title: Title, private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
   this.title.setTitle("Delete Car");
  }

  public getCar():void {
    this.adminService.getCar(this.car.id).subscribe(car => {
      console.log(`Success! `,
        this.car.id = car.id, 
        this.car.number = car.number,
        this.car.color = car.color,
        this.car.type = car.type,
        this.car.amount = car.amount, 
        this.car.price = car.price, 
        this.car.image = car.image);
      this.router.navigate(["/admin/delete-car/car-id/"+this.car.id]);
    }, err => {
      console.log(`Failed on get Car! Wrong ID: `,this.car.id + `\n` +err.message);
      alert(`Error on view Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.car.id}`);
    });
  }

  public deleteCar(): void {
    if(confirm(`Are You sure You want to remove this Car? ` + `\n` + `Car ID: ${this.car.id}`)) {
      this.adminService.deleteCar(this.car.id).subscribe((c) => {
      console.log(`Success on delele Car Id: `,this.car.id = c.id);
        alert(`Car Id: ${c.id} Number: `+c.number+ ` has been succesfully deleted!`);
        this.router.navigate(["/admin/view-all-cars"]);
    }, err => {
      console.log(`Failed on delele Car! Wrong ID: `,this.car.id + `\n` +err.message);
      alert(`Error on delele Car! ` + `\n` + `The reasons: ` + `\n` + 
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
