import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-client-cars-by-color',
  templateUrl: './view-all-client-cars-by-color.component.html',
  styleUrls: ['./view-all-client-cars-by-color.component.css']
})
export class ViewAllClientCarsByColorComponent implements OnInit {

  public cars: Car[];
  public car = new Car();
  public client = new Client();

  showImage: boolean = false;

  public constructor(private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    
  }

  public getAllClientCarsByColor(id: number, color: string): void {
    this.adminService.getAllClientCarsByColor(id, color).subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Client Cars By Color! `+ `\n` +err.message);
      alert(`Error on view all Client Cars by color! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by color ${this.car.color}`);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
