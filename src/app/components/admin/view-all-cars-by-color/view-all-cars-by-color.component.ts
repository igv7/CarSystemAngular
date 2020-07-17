import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-cars-by-color',
  templateUrl: './view-all-cars-by-color.component.html',
  styleUrls: ['./view-all-cars-by-color.component.css']
})
export class ViewAllCarsByColorComponent implements OnInit {

  public cars: Car[];
  public car = new Car();

  showImage: boolean = false;

  public constructor(private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    
  }

  public getAllCarsByColor(color: string): void {
    this.adminService.getAllCarsByColor(color).subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Cars By Color! `+ `\n` +err.message);
      alert(`Error on get all Cars By Color! ` + `\n` +err.message);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
