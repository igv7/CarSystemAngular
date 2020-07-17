import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  public car: Car;
  public client = new Client();

  public constructor(private activatedRoute: ActivatedRoute, private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getCars().subscribe((cars) => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.car = cars.find(c => c.id == id);
      console.log(`Success on get Car details! `);
    }, err => {
      console.log(`Failed on get Car details! ` + `\n` +err.message);
      alert(`Error on get Car details! ` + `\n` +err.message);
    });
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
      // this.router.navigate(["/client/view-car/car-id/"+this.car.id]);
      this.router.navigate(["/client/view-my-cars"]);
    }, err => {
      console.log(`Failed on get Car ID: `,this.car.id + `\n` +err.message);
      alert(`Error on get Car! Wrong ID: ${this.car.id}` +` `+ `\n`+err.message);
    });
  }

  // public returnCar(id: number): void {
  //   this.clientService.returnCar(id).subscribe((c) => {
  //     console.log(`Success on return Car Id: `,this.car.id = c.id);
  //       alert(`Car Id: ${c.id} Number: `+c.number+ ` has been succesfully returned!`);
  //       this.router.navigate(["/client/view-my-cars"]);
  //   }, err => {
  //     console.log(`Failed on delele Car Id: `,this.car.id + `\n` +err.message);
  //     alert(`Error on delete Car! Wrong Id: ${this.car.id}` +` `+ `\n`+err.message);
  //   });
  // }

  public backToCars(): void {
    this.router.navigate(["/client/view-cars"]);
  }

  public backToMyCars(): void {
    this.router.navigate(["/client/view-my-cars"]);
  }

}
