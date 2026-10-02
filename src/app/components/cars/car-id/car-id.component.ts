import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-car-id',
  templateUrl: './car-id.component.html',
  styleUrls: ['./car-id.component.css']
})
export class CarIdComponent implements OnInit {

  public car: Car;

  private log = this.logger.for('CarIdComponent');

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService, private logger: LoggerService) { }

  public ngOnInit(): void {
    this.adminService.getAllCars().subscribe(cars => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.car = cars.find(c => c.id == id);
      this.log.debug(`Success! `);
    }, err => {
      this.log.error(`Failed! `, err);
      alert(`Error! ` + `\n` +err.message);
    });
    
  }

}
