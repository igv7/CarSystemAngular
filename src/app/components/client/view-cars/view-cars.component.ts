import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-view-cars',
  templateUrl: './view-cars.component.html',
  styleUrls: ['./view-cars.component.css']
})
export class ViewCarsComponent implements OnInit {

  public cars: Car[];
  public car = new Car();

  listFilter: string = "";

  showImage: boolean = false;

  private log = this.logger.for('ViewCarsComponent');

  public constructor(private title: Title, private clientService: ClientService, private router: Router, private logger: LoggerService) { }

  public ngOnInit(): void {
    this.clientService.getCars().subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Cars! `, err);
      alert(`Error on view all Cars! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Cars`);
    });
    this.title.setTitle("All cars");
  }

  public getCar(id: number):void {
    this.clientService.getCar(id).subscribe(car => {
      this.log.debug(`Success! `,
        this.car.id = car.id, 
        this.car.number = car.number,
        this.car.color = car.color,
        this.car.type = car.type,
        this.car.amount = car.amount, 
        this.car.price = car.price, 
        this.car.image = car.image);
      this.router.navigate(["/client/view-my-cars"]);
    }, err => {
      this.log.error(`Failed on get Car ID: `, this.car.id, err);
      alert(`Error on get Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
  }

  public backToMainPage(): void {
    this.router.navigate(["/client"]);
    this.title.setTitle("Client Page");
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
