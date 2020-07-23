import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-all-cars-by-color',
  templateUrl: './view-all-cars-by-color.component.html',
  styleUrls: ['./view-all-cars-by-color.component.css']
})
export class ViewAllCarsByColorComponent implements OnInit {

  public cars: Car[];
  public car = new Car();

  showImage: boolean = false;

  public constructor(private title: Title, private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.title.setTitle("All Cars By Color")
  }

  public getAllCarsByColor(color: string): void {
    this.adminService.getAllCarsByColor(color).subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Cars By Color! `+ `\n` +err.message);
      alert(`Error on view all Cars by color! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars` + `\n` + 
      `4. No cars by color: ${this.car.color}`);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
    this.title.setTitle("Admin Page");
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
