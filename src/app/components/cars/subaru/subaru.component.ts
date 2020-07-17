import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subaru',
  templateUrl: './subaru.component.html',
  styleUrls: ['./subaru.component.css']
})
export class SubaruComponent implements OnInit {

  public cars: Car[];
  type: string = "SUBARU";


  // showImage: boolean = false;

  public constructor(private carService: CarService, private router: Router) { }

  public ngOnInit(): void {
    this.carService.getAllCarsByType(this.type).subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Cars By Type! `+ `\n` +err.message);
      alert(`Error on get all Cars By Type! ` + `\n` +err.message);
    });
  }

  public backToHome(): void {
    this.router.navigate(["/home"]);
  }

  // public toggleImage() {
  //   this.showImage = !this.showImage;
  // }

}
