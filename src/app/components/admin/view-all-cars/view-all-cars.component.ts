import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';

@Component({
  selector: 'app-view-all-cars',
  templateUrl: './view-all-cars.component.html',
  styleUrls: ['./view-all-cars.component.css']
})
export class ViewAllCarsComponent implements OnInit {

  /** Route links used by the template. */
  public readonly routes = AppRoutes;
  /** Route segments used by the template's detail links. */
  public readonly paths = RoutePaths;

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];

  /** Text typed into the filter box; the table is filtered by it through a pipe. */
  listFilter: string = "";

  /** Whether the table shows car pictures; switched by toggleImage(). */
  showImage: boolean = false;

  private log = this.logger.for('ViewAllCarsComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Loads all cars into the table. */
  public ngOnInit(): void {
    this.adminService.getAllCars().subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      this.log.error(`Failed on get all Cars! `, err);
      alert(`Error on view all Cars! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Cars`);
    });
    this.title.setTitle(PageTitles.ALL_CARS);
  }

  /** Returns to /admin. */
  public backToAdmin(): void {
    this.router.navigate([AppRoutes.ADMIN]);
    this.title.setTitle(PageTitles.ADMIN);
  }

  /** Shows or hides the car pictures in the table. */
  public toggleImage() {
    this.showImage = !this.showImage;
  }

}
