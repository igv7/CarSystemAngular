import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-view-all-client-cars',
  templateUrl: './view-all-client-cars.component.html',
  styleUrls: ['./view-all-client-cars.component.css']
})
export class ViewAllClientCarsComponent implements OnInit {

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  public car = new Car();
  /** Form model; `id` holds the client to look up. */
  public client = new Client();

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  private log = this.logger.for('ViewAllClientCarsComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle("All Client Cars");
  }

  /** Loads the cars rented by the given client into the table. */
  public getAllClientCars(id: number): void {
    this.adminService.getAllClientCars(id).subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Client Cars! `, err);
      alert(`Error on view all Client Cars! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. This Client has no cars` + `\n` + 
      `4. Wrong Client ID: ${this.client.id}`);
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
