import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];

  /** Text typed into the filter box; the table is filtered by it through a pipe. */
  listFilter: string = "";

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('CarsComponent');

  public constructor(private title: Title, private carService: CarService, private router: Router, private logger: LoggerService) { }

  /** Loads all cars into the table. */
  public ngOnInit(): void {
    this.carService.getAllCars().subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      this.message = cars.length ? null : Messages.NO_CARS;
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Cars! `, err);
      this.cars = null;
      this.message = loadErrorMessage(err);
    });
    this.title.setTitle(PageTitles.ALL_CARS);
  }

  /** Returns to /home. */
  public backToHome(): void {
    this.router.navigate([AppRoutes.HOME]);
  }

  /** Shows or hides the car pictures in the table. */
  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
