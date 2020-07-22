import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-mercedes',
  templateUrl: './mercedes.component.html',
  styleUrls: ['./mercedes.component.css']
})
export class MercedesComponent implements OnInit {

  public cars: Car[];
  type: string = "MERCEDES";

  showImage: boolean = false;

  public constructor(private title: Title, private carService: CarService, private router: Router) { }

  public ngOnInit(): void {
    this.carService.getAllCarsByType(this.type).subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Cars By Type ${this.type}! `+ `\n` +err.message);
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
