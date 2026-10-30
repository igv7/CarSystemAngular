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
import { AppRoutes, ID_PARAM, RoutePaths } from 'src/app/constants/app-routes';


const routes: Routes = [
  { path: RoutePaths.HOME, component: HomeComponent },
  { path: RoutePaths.CARS, component: CarsComponent },
  { path: RoutePaths.AUDI, component: AudiComponent },
  { path: RoutePaths.BMW, component: BmwComponent },
  { path: RoutePaths.HONDA, component: HondaComponent },
  { path: RoutePaths.MAZDA, component: MazdaComponent },
  { path: RoutePaths.MERCEDES, component: MercedesComponent },
  { path: RoutePaths.MITSUBISHI, component: MitsubishiComponent },
  { path: RoutePaths.SUBARU, component: SubaruComponent },
  { path: RoutePaths.TOYOTA, component: ToyotaComponent },
  { path: RoutePaths.VOLKSWAGEN, component: VolkswagenComponent },
  { path: RoutePaths.CLIENT, canActivate: [ClientGuardService], canDeactivate: [ExitClientGuardService], component: ClientComponent, children: [
    { path: RoutePaths.VIEW_CARS, component: ViewCarsComponent, children: [
      { path: `${RoutePaths.DETAILS}/:${ID_PARAM}`, component: DetailsComponent }
    ]},
    { path: RoutePaths.VIEW_MY_CARS, component: ViewMyCarsComponent, children: [
      { path: `${RoutePaths.DETAILS}/:${ID_PARAM}`, component: DetailsComponent }
    ]},
    { path: RoutePaths.VIEW_MY_RECEIPTS, component: ViewMyReceiptsComponent, children: [
      { path: `${RoutePaths.DETAILS_RECEIPT}/:${ID_PARAM}`, component: DetailsReceiptComponent }
    ]},
    { path: RoutePaths.VIEW_MY_BALANCE, component: ViewMyBalanceComponent },
    { path: RoutePaths.DELETE_ACCOUNT, component: DeleteAccountComponent }
  ]},
  { path: RoutePaths.ADMIN, canActivate: [AdminGuardService], canDeactivate: [ExitAdminGuardService], component: AdminComponent, children: [
    { path: RoutePaths.ADD_CLIENT, component: AddClientComponent },
    { path: RoutePaths.UPDATE_CLIENT, component: UpdateClientComponent, children: [
      { path: `${RoutePaths.CLIENT_ID}/:${ID_PARAM}`, component: ClientIdComponent }
    ]},
    { path: RoutePaths.VIEW_CLIENT, component: ViewClientComponent, children: [
      { path: `${RoutePaths.CLIENT_ID}/:${ID_PARAM}`, component: ClientIdComponent }
    ]},
    { path: RoutePaths.VIEW_ALL_CLIENTS, component: ViewAllClientsComponent, children: [
      { path: `${RoutePaths.CLIENT_DETAILS}/:${ID_PARAM}`, component: ClientDetailsComponent }
    ]},
    { path: RoutePaths.DELETE_CLIENT, component: DeleteClientComponent, children: [
      { path: `${RoutePaths.CLIENT_ID}/:${ID_PARAM}`, component: ClientIdComponent }
    ]},
    { path: RoutePaths.ADD_CAR, component: AddCarComponent },
    { path: RoutePaths.UPDATE_CAR, component: UpdateCarComponent, children: [
      { path: `${RoutePaths.CAR_ID}/:${ID_PARAM}`, component: CarIdComponent }
    ]},
    { path: RoutePaths.VIEW_CAR, component: ViewCarComponent, children: [
      { path: `${RoutePaths.CAR_ID}/:${ID_PARAM}`, component: CarIdComponent }
    ]},
    { path: RoutePaths.VIEW_CAR_BY_NUMBER, component: ViewCarByNumberComponent, children: [
      { path: `${RoutePaths.CAR_ID}/:${ID_PARAM}`, component: CarIdComponent }
    ]},
    { path: RoutePaths.VIEW_ALL_CARS, component: ViewAllCarsComponent, children: [
      { path: `${RoutePaths.CAR_DETAILS}/:${ID_PARAM}`, component: CarDetailsComponent }
    ]},
    { path: RoutePaths.DELETE_CAR, component: DeleteCarComponent, children: [
      { path: `${RoutePaths.CAR_ID}/:${ID_PARAM}`, component: CarIdComponent }
    ]},
    { path: RoutePaths.VIEW_ALL_CARS_BY_TYPE, component: ViewAllCarsByTypeComponent },
    { path: RoutePaths.VIEW_ALL_CARS_BY_COLOR, component: ViewAllCarsByColorComponent },
    { path: RoutePaths.RETURN_CAR, component: ReturnCarComponent, children: [
      { path: `${RoutePaths.CAR_ID}/:${ID_PARAM}`, component: CarIdComponent }
    ]},
    { path: RoutePaths.VIEW_CLIENT_CAR_BY_NUMBER, component: ViewClientCarByNumberComponent, children: [
      { path: `${RoutePaths.CAR_ID}/:${ID_PARAM}`, component: CarIdComponent }
    ]},
    { path: RoutePaths.VIEW_ALL_CLIENT_CARS, component: ViewAllClientCarsComponent },
    { path: RoutePaths.VIEW_ALL_CLIENT_CARS_BY_TYPE, component: ViewAllClientCarsByTypeComponent },
    { path: RoutePaths.VIEW_ALL_CLIENT_CARS_BY_COLOR, component: ViewAllClientCarsByColorComponent },
    { path: RoutePaths.VIEW_ALL_CLIENT_CARS_BY_PRICE_UNTIL, component: ViewAllClientCarsByPriceUntilComponent },
    { path: RoutePaths.VIEW_RECEIPTS_BY_CLIENT, component: ViewReceiptsByClientComponent },
    { path: RoutePaths.VIEW_ALL_RECEIPTS, component: ViewAllReceiptsComponent, children: [
      { path: `${RoutePaths.RECEIPT_DETAILS}/:${ID_PARAM}`, component: ReceiptDetailsComponent }
    ]},
  ]},
  { path: RoutePaths.LOGIN, component: LoginComponent },
  { path: RoutePaths.SIGNUP, component: SignupComponent },
  { path: RoutePaths.ABOUT, component: AboutComponent },
  { path: "", redirectTo: AppRoutes.HOME, pathMatch: "full" },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

