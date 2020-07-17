import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-car-by-number',
  templateUrl: './view-car-by-number.component.html',
  styleUrls: ['./view-car-by-number.component.css']
})
export class ViewCarByNumberComponent implements OnInit {

  public car = new Car();

  public constructor(private adminService: AdminService, private router: Router) { } //, private activatedRoute: ActivatedRoute

  ngOnInit() {
  }

  public getCarByNumber():void {
    this.adminService.getCarByNumber(this.car.number).subscribe(car => {
      console.log(`Success! `,
        this.car.id = car.id, 
        this.car.number = car.number,
        this.car.color = car.color,
        this.car.type = car.type,
        this.car.amount = car.amount, 
        this.car.price = car.price, 
        this.car.image = car.image);
      this.router.navigate(["/admin/view-car-by-number/car-id/"+this.car.id]); //number
    }, err => {
      console.log(`Failed on get Car number: `,this.car.number + `\n` +err.message);
      alert(`Error on get Car! Wrong number: ${this.car.number}` +` `+ `\n`+err.message);
    });
  }

  public cancel() {
    this.router.navigate(["/admin"])
  }

  public close() {
    this.router.navigate(["/admin"])
  }

}
