import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  public car: Car;
  public client = new Client();

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getCars().subscribe((cars) => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.car = cars.find(c => c.id == id);
      console.log(`Success on get Car details! `);
    }, err => {
      console.log(`Failed on get Car details! ` + `\n` +err.message);
      alert(`Error on view Car details! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
    this.title.setTitle("Details");
  }

  public getCar(id: number):void {
    this.clientService.getCar(id).subscribe(car => {
      console.log(`Success! `,
        this.car.id = car.id, 
        this.car.number = car.number,
        this.car.color = car.color,
        this.car.type = car.type,
        this.car.amount = car.amount, 
        this.car.price = car.price, 
        this.car.image = car.image);
      this.router.navigate(["/client/view-my-cars"]);
    }, err => {
      console.log(`Failed on get Car ID: `,this.car.id + `\n` +err.message);
      alert(`Error on get Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.car.id}`);
    });
  }

  public backToCars(): void {
    this.router.navigate(["/client/view-cars"]);
  }

  public backToMyCars(): void {
    this.router.navigate(["/client/view-my-cars"]);
  }

}
