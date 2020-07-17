import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-client-cars-by-price-until',
  templateUrl: './view-all-client-cars-by-price-until.component.html',
  styleUrls: ['./view-all-client-cars-by-price-until.component.css']
})
export class ViewAllClientCarsByPriceUntilComponent implements OnInit {

  public cars: Car[];
  public car = new Car();
  public client = new Client();

  showImage: boolean = false;

  public constructor(private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    
  }

  public getAllClientCarsByPrice(id: number, price: number): void {
    this.adminService.getAllClientCarsByPrice(id, price).subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Client Cars By Price! `+ `\n` +err.message);
      alert(`Error on get all Client Cars By Price! ` + `\n` +err.message);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
