import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-view-my-cars',
  templateUrl: './view-my-cars.component.html',
  styleUrls: ['./view-my-cars.component.css']
})
export class ViewMyCarsComponent implements OnInit {

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  public car = new Car();

  /** Text typed into the filter box; the table is filtered by it through a pipe. */
  listFilter: string = "";

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  private log = this.logger.for('ViewMyCarsComponent');

  public constructor(private title: Title, private clientService: ClientService, private router: Router, private logger: LoggerService) { }

  /** Loads the client's rented cars into the table. */
  public ngOnInit(): void {
    this.clientService.getMyCars().subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get My Cars! `, err);
      alert(`Error on view My Cars! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Cars`);
    });
    this.title.setTitle("My cars");
  }

  /** Reloads the whole page so the table shows the current rentals. */
  public refresh(): void {
    window.location.reload();
}

  /** After confirmation, returns the rented car and reloads the page. */
  public returnCar(id: number): void {
    if(confirm(`Are You sure You want to return Your Car?`)) {
    this.clientService.returnCar(id).subscribe((c) => {
      this.log.info(`Success on return Car Id: `,this.car.id = c.id);
        alert(`Car Number: `+c.number+ ` has been succesfully returned!`);
        this.refresh();
    }, err => {
      this.log.error(`Failed on delete Car Id: `, this.car.id, err);
      alert(`Error on delele Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
   }
  }


  /** Returns to /client. */
  public backToMainPage(): void {
    this.router.navigate(["/client"]);
    this.title.setTitle("Client Page");
  }

  /** Shows or hides the car pictures in the table. */
  public toggleImage() {
    this.showImage = !this.showImage;
  }
  

}
