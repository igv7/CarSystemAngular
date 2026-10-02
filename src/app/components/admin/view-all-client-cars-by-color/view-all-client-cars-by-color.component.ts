import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-view-all-client-cars-by-color',
  templateUrl: './view-all-client-cars-by-color.component.html',
  styleUrls: ['./view-all-client-cars-by-color.component.css']
})
export class ViewAllClientCarsByColorComponent implements OnInit {

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  /** Form model; `color` holds the selected color. */
  public car = new Car();
  /** Form model; `id` holds the client to look up. */
  public client = new Client();

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  private log = this.logger.for('ViewAllClientCarsByColorComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle("All Client Cars By Color");
  }

  /** Loads the given client's rented cars of the selected color into the table. */
  public getAllClientCarsByColor(id: number, color: string): void {
    this.adminService.getAllClientCarsByColor(id, color).subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Client Cars By Color! `, err);
      alert(`Error on view all Client Cars by color! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. This Client has no cars` + `\n` + 
      `4. No Client Cars by color ${this.car.color}` + `\n` + 
      `5. Wrong Client ID: ${this.client.id}`);
    });
  }

  /** Returns to /admin. */
  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
    this.title.setTitle("Admin Page");
  }

  /** Shows or hides the car pictures in the table. */
  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
