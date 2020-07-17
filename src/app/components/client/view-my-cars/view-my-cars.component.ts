import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-my-cars',
  templateUrl: './view-my-cars.component.html',
  styleUrls: ['./view-my-cars.component.css']
})
export class ViewMyCarsComponent implements OnInit {

  public cars: Car[];
  public car = new Car();

  listFilter: string = "";

  showImage: boolean = false;

  public constructor(private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getMyCars().subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get My Cars! `+ `\n` +err.message);
      // alert(`Error on get My Cars! ` + `\n` +err.message);
    });
  }

  public refresh(): void {
    window.location.reload();
}

  public returnCar(id: number): void {
    this.clientService.returnCar(id).subscribe((c) => {
      console.log(`Success on return Car Id: `,this.car.id = c.id);
        // alert(`Car Id: ${c.id} Number: `+c.number+ ` has been succesfully returned!`);
        // this.router.navigate(["/client/view-my-cars"]);
        this.refresh();
    }, err => {
      console.log(`Failed on delele Car Id: `,this.car.id + `\n` +err.message);
      alert(`Error on delete Car! Wrong Id: ${this.car.id}` +` `+ `\n`+err.message);
    });
  }


  public backToMainPage(): void {
    this.router.navigate(["/client"]);
  }

  public backToCars(): void {
    this.router.navigate(["/client/view-cars"]);
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }
  

}
