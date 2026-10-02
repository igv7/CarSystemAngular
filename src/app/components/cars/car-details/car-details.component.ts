import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {

  public car: Car;

  private log = this.logger.for('CarDetailsComponent');

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

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

  public backToAllCars(): void {
    this.router.navigate(["/admin/view-all-cars"]);
  }

}
