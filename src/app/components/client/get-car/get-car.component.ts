// import { Component, OnInit } from '@angular/core';
// import { Car } from 'src/app/models/car';
// import { ClientService } from 'src/app/services/client.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-get-car',
//   templateUrl: './get-car.component.html',
//   styleUrls: ['./get-car.component.css']
// })
// export class GetCarComponent implements OnInit {

//   public car = new Car();

//   public constructor(private clientService: ClientService, private router: Router) { } //, private activatedRoute: ActivatedRoute

//   ngOnInit() {
//   }

//   public getCar():void {
//     this.clientService.getCar(this.car.id).subscribe(car => {
//       console.log(`Success! `,
//         this.car.id = car.id, 
//         this.car.number = car.number,
//         this.car.color = car.color,
//         this.car.type = car.type,
//         this.car.amount = car.amount, 
//         this.car.price = car.price, 
//         this.car.image = car.image);
//       // this.router.navigate(["/client/view-car/car-id/"+this.car.id]);
//       this.router.navigate(["/client/view-all-cars"]);
//     }, err => {
//       console.log(`Failed on get Car ID: `,this.car.id + `\n` +err.message);
//       alert(`Error on get Car! Wrong ID: ${this.car.id}` +` `+ `\n`+err.message);
//     });
//   }

//   public cancel() {
//     this.router.navigate(["/client"])
//   }

//   public close() {
//     this.router.navigate(["/client"])
//   }

// }
