import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-all-client-cars',
  templateUrl: './view-all-client-cars.component.html',
  styleUrls: ['./view-all-client-cars.component.css']
})
export class ViewAllClientCarsComponent implements OnInit {

  public cars: Car[];
  public car = new Car();
  public client = new Client();

  showImage: boolean = false;

  public constructor(private title: Title, private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.title.setTitle("All Client Cars");
  }

  public getAllClientCars(id: number): void {
    this.adminService.getAllClientCars(id).subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Client Cars! `+ `\n` +err.message);
      alert(`Error on view all Client Cars! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. This Client has no cars` + `\n` + 
      `4. Wrong Client ID: ${this.client.id}`);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
