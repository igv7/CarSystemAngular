import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

/** Car details shown under the client's car lists (`details/:id`), with a Rent button. */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  /** The car picked by the id in the URL. */
  public car: Car;
  public client = new Client();

  private log = this.logger.for('DetailsComponent');

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private clientService: ClientService, private router: Router, private logger: LoggerService) { }

  /** Loads the rentable cars and shows the one whose id is in the URL. */
  public ngOnInit(): void {
    this.clientService.getCars().subscribe((cars) => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.car = cars.find(c => c.id == id);
      this.log.debug(`Success on get Car details! `);
    }, err => {
      this.log.error(`Failed on get Car details! `, err);
      alert(`Error on view Car details! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
    this.title.setTitle("Details");
  }

  /** Rents the car for the logged-in client and opens their rented cars. */
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
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.car.id}`);
    });
  }

  /** Returns to /client/view-cars. */
  public backToCars(): void {
    this.router.navigate(["/client/view-cars"]);
  }

  /** Returns to /client/view-my-cars. */
  public backToMyCars(): void {
    this.router.navigate(["/client/view-my-cars"]);
  }

}
