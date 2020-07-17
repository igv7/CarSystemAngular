import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  public cars: Car[];

  listFilter: string = "";

  showImage: boolean = false;

  public constructor(private title: Title, private carService: CarService, private router: Router) { }

  public ngOnInit(): void {
    this.carService.getAllCars().subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Cars! `+ `\n` +err.message);
      // alert(`Error on get all Cars! ` + `\n` +err.message);
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
