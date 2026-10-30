import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-view-my-cars',
  templateUrl: './view-my-cars.component.html',
  styleUrls: ['./view-my-cars.component.css']
})
export class ViewMyCarsComponent implements OnInit {

  /** Route links used by the template. */
  public readonly routes = AppRoutes;
  /** Route segments used by the template's detail links. */
  public readonly paths = RoutePaths;

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  public car = new Car();

  /** Text typed into the filter box; the table is filtered by it through a pipe. */
  listFilter: string = "";

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ViewMyCarsComponent');

  public constructor(private title: Title, private clientService: ClientService, private router: Router, private logger: LoggerService) { }

  /** Loads the client's rented cars into the table. */
  public ngOnInit(): void {
    this.clientService.getMyCars().subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      this.message = cars.length ? null : Messages.NO_MY_CARS;
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get My Cars! `, err);
      this.cars = null;
      this.message = loadErrorMessage(err);
    });
    this.title.setTitle(PageTitles.MY_CARS);
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
    this.router.navigate([AppRoutes.CLIENT]);
    this.title.setTitle(PageTitles.CLIENT);
  }

  /** Shows or hides the car pictures in the table. */
  public toggleImage() {
    this.showImage = !this.showImage;
  }
  

}
