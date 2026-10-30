import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, ID_PARAM } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

/** Car details shown under the admin's car list (`car-details/:id`). */
@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {

  /** The car picked by the id in the URL. */
  public car: Car;

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('CarDetailsComponent');

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Loads all cars and shows the one whose id is in the URL. */
  public ngOnInit(): void {
    this.adminService.getAllCars().subscribe((cars) => {
      const id = +this.activatedRoute.snapshot.params[ID_PARAM];
      this.car = cars.find(c => c.id == id);
      this.message = this.car ? null : Messages.wrongCarId(id);
      this.log.debug(`Success on get Car details! `);
    }, err => {
      this.log.error(`Failed on get Car details! `, err);
      this.message = loadErrorMessage(err);
    });
    this.title.setTitle(PageTitles.CAR_DETAILS);
  }

  /** Returns to /admin/view-all-cars. */
  public backToAllCars(): void {
    this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_CARS]);
  }

}
