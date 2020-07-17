import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {

  public car: Car;

  public constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.adminService.getAllCars().subscribe((cars) => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.car = cars.find(c => c.id == id);
      console.log(`Success on get Car details! `);
    }, err => {
      console.log(`Failed on get Car details! ` + `\n` +err.message);
      alert(`Error on get Car details! ` + `\n` +err.message);
    });
  }

  public backToAllCars(): void {
    this.router.navigate(["/admin/view-all-cars"]);
  }

}
