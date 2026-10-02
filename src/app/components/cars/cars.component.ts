import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  public cars: Car[];

  listFilter: string = "";

  showImage: boolean = false;

  private log = this.logger.for('CarsComponent');

  public constructor(private title: Title, private carService: CarService, private router: Router, private logger: LoggerService) { }

  public ngOnInit(): void {
    this.carService.getAllCars().subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Cars! `, err);
      alert(`Error on view all Cars! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Cars`);
    });
    this.title.setTitle("All cars");
  }

  public backToHome(): void {
    this.router.navigate(["/home"]);
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
