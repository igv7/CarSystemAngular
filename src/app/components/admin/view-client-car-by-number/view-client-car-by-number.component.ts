import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';

@Component({
  selector: 'app-view-client-car-by-number',
  templateUrl: './view-client-car-by-number.component.html',
  styleUrls: ['./view-client-car-by-number.component.css']
})
export class ViewClientCarByNumberComponent implements OnInit {

  public car = new Car();
  public client = new Client();

  public constructor(private adminService: AdminService, private router: Router) { } //, private activatedRoute: ActivatedRoute

  ngOnInit() {
  }

  public getClientCarByNumber(id: number, number: string):void {
    this.adminService.getClientCarByNumber(id, number).subscribe(car => {
      console.log(`Success! `,
        this.car.id = car.id, 
        this.car.number = car.number,
        this.car.color = car.color,
        this.car.type = car.type,
        this.car.amount = car.amount, 
        this.car.price = car.price, 
        this.car.image = car.image);
      this.router.navigate(["/admin/view-client-car-by-number/car-id/"+this.car.id]); //number
    }, err => {
      console.log(`Failed on get Client Car by number: `,this.car.number + `\n` +err.message);
      alert(`Error on get Client Car! Wrong number: ${this.car.number}` +` `+ `\n`+err.message);
    });
  }

  public cancel() {
    this.router.navigate(["/admin"])
  }

  public close() {
    this.router.navigate(["/admin"])
  }

}
