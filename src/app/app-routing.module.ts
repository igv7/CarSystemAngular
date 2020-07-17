import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CarsComponent } from './components/cars/cars.component';
import { Page404Component } from './components/page404/page404.component';
import { ClientComponent } from './components/client/client.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { AdminGuardService } from './services/admin-guard.service';
import { ExitAdminGuardService } from './services/exit-admin-guard.service';
import { ClientGuardService } from './services/client-guard.service';
import { ExitClientGuardService } from './services/exit-client-guard.service';
import { SignupComponent } from './components/signup/signup.component';
import { AudiComponent } from './components/cars/audi/audi.component';
import { BmwComponent } from './components/cars/bmw/bmw.component';
import { HondaComponent } from './components/cars/honda/honda.component';
import { MazdaComponent } from './components/cars/mazda/mazda.component';
import { MercedesComponent } from './components/cars/mercedes/mercedes.component';
import { MitsubishiComponent } from './components/cars/mitsubishi/mitsubishi.component';
import { SubaruComponent } from './components/cars/subaru/subaru.component';
import { ToyotaComponent } from './components/cars/toyota/toyota.component';
import { VolkswagenComponent } from './components/cars/volkswagen/volkswagen.component';
import { AddClientComponent } from './components/admin/add-client/add-client.component';
import { DeleteClientComponent } from './components/admin/delete-client/delete-client.component';
import { UpdateClientComponent } from './components/admin/update-client/update-client.component';
import { ViewClientComponent } from './components/admin/view-client/view-client.component';
import { ViewAllClientsComponent } from './components/admin/view-all-clients/view-all-clients.component';
import { AddCarComponent } from './components/admin/add-car/add-car.component';
import { UpdateCarComponent } from './components/admin/update-car/update-car.component';
import { ViewCarComponent } from './components/admin/view-car/view-car.component';
import { ViewAllCarsComponent } from './components/admin/view-all-cars/view-all-cars.component';
import { ViewCarByNumberComponent } from './components/admin/view-car-by-number/view-car-by-number.component';
import { DeleteCarComponent } from './components/admin/delete-car/delete-car.component';
import { ViewAllCarsByTypeComponent } from './components/admin/view-all-cars-by-type/view-all-cars-by-type.component';
import { ViewAllCarsByColorComponent } from './components/admin/view-all-cars-by-color/view-all-cars-by-color.component';
import { ViewClientCarByNumberComponent } from './components/admin/view-client-car-by-number/view-client-car-by-number.component';
import { ViewAllClientCarsComponent } from './components/admin/view-all-client-cars/view-all-client-cars.component';
import { ViewAllClientCarsByTypeComponent } from './components/admin/view-all-client-cars-by-type/view-all-client-cars-by-type.component';
import { ViewAllClientCarsByColorComponent } from './components/admin/view-all-client-cars-by-color/view-all-client-cars-by-color.component';
import { ViewAllClientCarsByPriceUntilComponent } from './components/admin/view-all-client-cars-by-price-until/view-all-client-cars-by-price-until.component';
import { ViewReceiptsByClientComponent } from './components/admin/view-receipts-by-client/view-receipts-by-client.component';
import { ViewAllReceiptsComponent } from './components/admin/view-all-receipts/view-all-receipts.component';
import { ViewMyBalanceComponent } from './components/client/view-my-balance/view-my-balance.component';
import { DeleteAccountComponent } from './components/client/delete-account/delete-account.component';
import { ClientDetailsComponent } from './components/client/client-details/client-details.component';
import { ClientIdComponent } from './components/client/client-id/client-id.component';
import { CarDetailsComponent } from './components/cars/car-details/car-details.component';
import { CarIdComponent } from './components/cars/car-id/car-id.component';
import { ReceiptDetailsComponent } from './components/admin/receipt-details/receipt-details.component';
import { ViewMyCarsComponent } from './components/client/view-my-cars/view-my-cars.component';
import { ViewCarsComponent } from './components/client/view-cars/view-cars.component';
import { DetailsComponent } from './components/cars/details/details.component';
import { ViewMyReceiptsComponent } from './components/client/view-my-receipts/view-my-receipts.component';
import { DetailsReceiptComponent } from './components/client/details-receipt/details-receipt.component';
import { ReturnCarComponent } from './components/admin/return-car/return-car.component';


const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "cars", component: CarsComponent },
  { path: "audi", component: AudiComponent },
  { path: "bmw", component: BmwComponent },
  { path: "honda", component: HondaComponent },
  { path: "mazda", component: MazdaComponent },
  { path: "mercedes", component: MercedesComponent },
  { path: "mitsubishi", component: MitsubishiComponent },
  { path: "subaru", component: SubaruComponent },
  { path: "toyota", component: ToyotaComponent },
  { path: "volkswagen", component: VolkswagenComponent },
  { path: "client", canActivate: [ClientGuardService], canDeactivate: [ExitClientGuardService], component: ClientComponent, children: [
    { path: "view-cars", component: ViewCarsComponent, children: [
      { path: "details/:id", component: DetailsComponent }
    ]},
    { path: "view-my-cars", component: ViewMyCarsComponent, children: [
      { path: "details/:id", component: DetailsComponent }
    ]},
    { path: "view-my-receipts", component: ViewMyReceiptsComponent, children: [
      { path: "details-receipt/:id", component: DetailsReceiptComponent }
    ]},
    { path: "view-my-balance", component: ViewMyBalanceComponent },
    { path: "delete-account", component: DeleteAccountComponent }
  ]},
  { path: "admin", canActivate: [AdminGuardService], canDeactivate: [ExitAdminGuardService], component: AdminComponent, children: [
    { path: "add-client", component: AddClientComponent },
    { path: "update-client", component: UpdateClientComponent, children: [
      { path: "client-id/:id", component: ClientIdComponent }
    ]},
    { path: "view-client", component: ViewClientComponent, children: [
      { path: "client-id/:id", component: ClientIdComponent }
    ]},
    { path: "view-all-clients", component: ViewAllClientsComponent, children: [
      { path: "client-details/:id", component: ClientDetailsComponent }
    ]},
    { path: "delete-client", component: DeleteClientComponent, children: [
      { path: "client-id/:id", component: ClientIdComponent }
    ]},
    { path: "add-car", component: AddCarComponent },
    { path: "update-car", component: UpdateCarComponent, children: [
      { path: "car-id/:id", component: CarIdComponent }
    ]},
    { path: "view-car", component: ViewCarComponent, children: [
      { path: "car-id/:id", component: CarIdComponent }
    ]},
    { path: "view-car-by-number", component: ViewCarByNumberComponent, children: [
      { path: "car-id/:id", component: CarIdComponent }
    ]},
    { path: "view-all-cars", component: ViewAllCarsComponent, children: [
      { path: "car-details/:id", component: CarDetailsComponent }
    ]},
    { path: "delete-car", component: DeleteCarComponent, children: [
      { path: "car-id/:id", component: CarIdComponent }
    ]},
    { path: "view-all-cars-by-type", component: ViewAllCarsByTypeComponent },
    { path: "view-all-cars-by-color", component: ViewAllCarsByColorComponent },
    { path: "return-car", component: ReturnCarComponent, children: [
      { path: "car-id/:id", component: CarIdComponent }
    ]},
    { path: "view-client-car-by-number", component: ViewClientCarByNumberComponent, children: [
      { path: "car-id/:id", component: CarIdComponent }
    ]},
    { path: "view-all-client-cars", component: ViewAllClientCarsComponent },
    { path: "view-all-client-cars-by-type", component: ViewAllClientCarsByTypeComponent },
    { path: "view-all-client-cars-by-color", component: ViewAllClientCarsByColorComponent },
    { path: "view-all-client-cars-by-price-until", component: ViewAllClientCarsByPriceUntilComponent },
    { path: "view-receipts-by-client", component: ViewReceiptsByClientComponent },
    { path: "view-all-receipts", component: ViewAllReceiptsComponent, children: [
      { path: "receipt-details/:id", component: ReceiptDetailsComponent }
    ]},
  ]},
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "about", component: AboutComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

