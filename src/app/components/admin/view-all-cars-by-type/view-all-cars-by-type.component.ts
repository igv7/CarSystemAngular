import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-cars-by-type',
  templateUrl: './view-all-cars-by-type.component.html',
  styleUrls: ['./view-all-cars-by-type.component.css']
})
export class ViewAllCarsByTypeComponent implements OnInit {

  public cars: Car[];
  public car = new Car();

  showImage: boolean = false;

  public constructor(private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    
  }

  public getAllCarsByType(type: string): void {
    this.adminService.getAllCarsByType(type).subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Cars By Type! `+ `\n` +err.message);
      alert(`Error on get all Cars By Type! ` + `\n` +err.message);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
