import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

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

  private log = this.logger.for('ViewAllClientCarsByPriceUntilComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  public ngOnInit(): void {
    this.title.setTitle("All Client Cars By Price");
  }

  public getAllClientCarsByPrice(id: number, price: number): void {
    this.adminService.getAllClientCarsByPrice(id, price).subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Client Cars By Price! `, err);
      alert(`Error on view all Client Cars by price! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. This Client has no cars` + `\n` + 
      `4. No cars by price until $${this.car.price}` + `\n` + 
      `5. Wrong Client ID: ${this.client.id}`);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
    this.title.setTitle("Admin Page");
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
