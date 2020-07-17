import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrls: ['./update-car.component.css']
})
export class UpdateCarComponent implements OnInit {

  public car = new Car();

  public constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    
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
      this.router.navigate(["/admin/update-car/car-id/"+this.car.id]);
    }, err => {
      console.log(`Failed on get Car ID: `,this.car.id + `\n` +err.message);
      alert(`Error on get Car! Wrong ID: ${this.car.id}` +` `+ `\n`+err.message);
    });
  }

  public updateCar(): void {
    this.adminService.updateCar(this.car).subscribe(car => {
      console.log(`Success on update Car! `,this.car = car);
      alert(`Car ID: ${this.car.id} has been succesfully updated! ` + 
      "\nId: " + car.id +
      "\nNumber: " + car.number +
      "\nColor: " + car.color +
      "\nType: " + car.type +
      "\nAmount: " + car.amount +
      "\nPrice: " + car.price +
      "\nImage: " + car.image);
      this.router.navigate(["/admin/view-all-cars"])
    }, err => {
      console.log(`Failed on update Car! `,this.car.id + `\n` +err.message);
      alert(`Error on update Car! Wrong ID: ${this.car.id}` +` `+ `\n`+err.message);
    });
  }



  public cancel() {
    this.router.navigate(["/admin"])
  }

  public close() {
    this.router.navigate(["/admin"])
  }

}
