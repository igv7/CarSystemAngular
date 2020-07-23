import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

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

  public constructor(private title: Title, private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getMyCars().subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
    }, err => {
      console.log(`Failed on get My Cars! `+ `\n` +err.message);
      alert(`Error on view My Cars! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Cars`);
    });
    this.title.setTitle("My cars");
  }

  public refresh(): void {
    window.location.reload();
}

  public returnCar(id: number): void {
    if(confirm(`Are You sure You want to return Your Car?`)) {
    this.clientService.returnCar(id).subscribe((c) => {
      console.log(`Success on return Car Id: `,this.car.id = c.id);
        alert(`Car Number: `+c.number+ ` has been succesfully returned!`);
        this.refresh();
    }, err => {
      console.log(`Failed on delele Car Id: `,this.car.id + `\n` +err.message);
      alert(`Error on delele Car! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
   }
  }


  public backToMainPage(): void {
    this.router.navigate(["/client"]);
    this.title.setTitle("Client Page");
  }

  public toggleImage() {
    this.showImage = !this.showImage;
  }
  

}
