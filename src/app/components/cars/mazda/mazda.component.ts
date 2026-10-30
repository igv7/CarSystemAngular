import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes } from 'src/app/constants/app-routes';
import { brandTitle } from 'src/app/constants/page-titles';
import { CarType } from 'src/app/models/car-type';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-mazda',
  templateUrl: './mazda.component.html',
  styleUrls: ['./mazda.component.css']
})
export class MazdaComponent implements OnInit {

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  /** Brand this page lists (a CarType value). */
  type: string = CarType.MAZDA;

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('MazdaComponent');

  public constructor(private title: Title, private carService: CarService, private router: Router, private logger: LoggerService) { }

  /** Loads the cars of this brand into the table. */
  public ngOnInit(): void {
    this.carService.getAllCarsByType(this.type).subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      this.message = cars.length ? null : Messages.noCarsOfType(this.type);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Cars By Type ${this.type}! `, err);
      this.cars = null;
      this.message = loadErrorMessage(err);
    });
    this.title.setTitle(brandTitle(this.type));
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
