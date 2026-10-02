import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

/** Car details shown under the admin's car list (`car-details/:id`). */
@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {

  /** The car picked by the id in the URL. */
  public car: Car;

  private log = this.logger.for('CarDetailsComponent');

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Loads all cars and shows the one whose id is in the URL. */
  public ngOnInit(): void {
    this.adminService.getAllCars().subscribe((cars) => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.car = cars.find(c => c.id == id);
      this.log.debug(`Success on get Car details! `);
    }, err => {
      this.log.error(`Failed on get Car details! `, err);
      alert(`Error on view Car details! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
    this.title.setTitle("Car Details");
  }

  /** Returns to /admin/view-all-cars. */
  public backToAllCars(): void {
    this.router.navigate(["/admin/view-all-cars"]);
  }

}
