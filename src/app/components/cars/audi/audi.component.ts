import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';
import { Car } from 'src/app/models/car';

@Component({
  selector: 'app-audi',
  templateUrl: './audi.component.html',
  styleUrls: ['./audi.component.css']
})
export class AudiComponent implements OnInit {

  public cars: Car[];
  type: string = "AUDI";


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
