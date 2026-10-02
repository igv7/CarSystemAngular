import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-mazda',
  templateUrl: './mazda.component.html',
  styleUrls: ['./mazda.component.css']
})
export class MazdaComponent implements OnInit {

  public cars: Car[];
  type: string = "MAZDA";

  showImage: boolean = false;

  private log = this.logger.for('MazdaComponent');

  public constructor(private title: Title, private carService: CarService, private router: Router, private logger: LoggerService) { }

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

  public backToHome(): void {
    this.router.navigate(["/home"]);
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
