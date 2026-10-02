import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-honda',
  templateUrl: './honda.component.html',
  styleUrls: ['./honda.component.css']
})
export class HondaComponent implements OnInit {

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  /** Brand this page lists (a CarType value). */
  type: string = "HONDA";

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  private log = this.logger.for('HondaComponent');

  public constructor(private title: Title, private carService: CarService, private router: Router, private logger: LoggerService) { }

  /** Loads the cars of this brand into the table. */
  public ngOnInit(): void {
    this.carService.getAllCarsByType(this.type).subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Cars By Type ${this.type}! `, err);
      alert(`Error on view all Cars By Type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Cars by type: ${this.type}`);
    });
    this.title.setTitle(`${this.type} cars`);
  }

  /** Returns to /home. */
  public backToHome(): void {
    this.router.navigate(["/home"]);
  }

  /** Shows or hides the car pictures in the table. */
  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
