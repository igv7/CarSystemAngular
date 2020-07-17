import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';

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

  public constructor(private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getCars().subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get all Cars! `+ `\n` +err.message);
      alert(`Error on get all Cars! ` + `\n` +err.message);
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

  public backToMainPage(): void {
    this.router.navigate(["/client"]);
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
