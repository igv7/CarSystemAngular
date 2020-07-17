import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-car-id',
  templateUrl: './car-id.component.html',
  styleUrls: ['./car-id.component.css']
})
export class CarIdComponent implements OnInit {

  public car: Car;

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService) { }

  public ngOnInit(): void {
    this.adminService.getAllCars().subscribe(cars => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.car = cars.find(c => c.id == id);
      console.log(`Success! `);
    }, err => {
      console.log(`Failed! ` + `\n` +err.message);
      alert(`Error! ` + `\n` +err.message);
    });
    
  }

}
