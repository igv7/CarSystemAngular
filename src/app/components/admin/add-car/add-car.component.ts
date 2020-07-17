import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {

  public car = new Car();

  public constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    
  }

  public addCar(): void {
    this.adminService.addCar(this.car).subscribe(car => {
      console.log(`Success on add Car! `,this.car = car);
      alert(`Car Number: ${this.car.number} has been succesfully added! ` + 
      "\nId: " + car.id +
      "\nNumber: " + car.number +
      "\nColor: " + car.color +
      "\nType: " + car.type +
      "\nAmount: " + car.amount +
      "\nPrice: " + car.price +
      "\nImage: " + car.image);
      this.router.navigate(["/admin/view-all-cars"])
    }, err => {
      console.log(`Failed on add Car! `,this.car.number + `\n` +err.message);
      alert(`Error on add Car! This Car number: ${this.car.number}` +` `+ 
      `already exists in the system!` +` `+ `\n`+err.message);
    });
  }



  public cancel() {
    this.router.navigate(["/admin"])
  }

  public close() {
    this.router.navigate(["/admin"])
  }

}
