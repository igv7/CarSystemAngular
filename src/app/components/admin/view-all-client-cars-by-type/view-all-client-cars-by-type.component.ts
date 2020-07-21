import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-all-client-cars-by-type',
  templateUrl: './view-all-client-cars-by-type.component.html',
  styleUrls: ['./view-all-client-cars-by-type.component.css']
})
export class ViewAllClientCarsByTypeComponent implements OnInit {

  public cars: Car[];
  public car = new Car();
  public client = new Client();

  showImage: boolean = false;

  public constructor(private title: Title, private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.title.setTitle("All Client Cars By Type");
  }

  public getAllClientCarsByType(id: number, type: string): void {
    this.adminService.getAllClientCarsByType(id, type).subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Client Cars By Type! `+ `\n` +err.message);
      alert(`Error on view all Client Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. This Client has no cars` + `\n` + 
      `4. No Client Cars by type ${this.car.type}` + `\n` + 
      `5. Wrong Client ID: ${this.client.id}`);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
