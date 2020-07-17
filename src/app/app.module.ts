import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { CarsComponent } from './components/cars/cars.component';
import { ClientComponent } from './components/client/client.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { Page404Component } from './components/page404/page404.component';
import { AboutComponent } from './components/about/about.component';
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
import { AuthService } from './services/auth.service';
import { AdminGuardService } from './services/admin-guard.service';
import { ExitAdminGuardService } from './services/exit-admin-guard.service';
import { ClientGuardService } from './services/client-guard.service';
import { ExitClientGuardService } from './services/exit-client-guard.service';
import { LoginService } from './services/login.service';
import { TokenInterceptorService } from './token-interceptor.service';
import { AddClientComponent } from './components/admin/add-client/add-client.component';
import { UpdateClientComponent } from './components/admin/update-client/update-client.component';
import { ViewClientComponent } from './components/admin/view-client/view-client.component';
import { ViewAllClientsComponent } from './components/admin/view-all-clients/view-all-clients.component';
import { DeleteClientComponent } from './components/admin/delete-client/delete-client.component';
import { AddCarComponent } from './components/admin/add-car/add-car.component';
import { UpdateCarComponent } from './components/admin/update-car/update-car.component';
import { ViewCarComponent } from './components/admin/view-car/view-car.component';
import { ViewCarByNumberComponent } from './components/admin/view-car-by-number/view-car-by-number.component';
import { ViewAllCarsComponent } from './components/admin/view-all-cars/view-all-cars.component';
import { DeleteCarComponent } from './components/admin/delete-car/delete-car.component';
import { ViewAllCarsByTypeComponent } from './components/admin/view-all-cars-by-type/view-all-cars-by-type.component';
import { ViewAllCarsByColorComponent } from './components/admin/view-all-cars-by-color/view-all-cars-by-color.component';
import { ViewClientCarByNumberComponent } from './components/admin/view-client-car-by-number/view-client-car-by-number.component';
import { ViewAllClientCarsByTypeComponent } from './components/admin/view-all-client-cars-by-type/view-all-client-cars-by-type.component';
import { ViewAllClientCarsByColorComponent } from './components/admin/view-all-client-cars-by-color/view-all-client-cars-by-color.component';
import { ViewAllClientCarsByPriceUntilComponent } from './components/admin/view-all-client-cars-by-price-until/view-all-client-cars-by-price-until.component';
import { ViewReceiptsByClientComponent } from './components/admin/view-receipts-by-client/view-receipts-by-client.component';
import { ViewAllReceiptsComponent } from './components/admin/view-all-receipts/view-all-receipts.component';
import { ViewMyBalanceComponent } from './components/client/view-my-balance/view-my-balance.component';
import { DeleteAccountComponent } from './components/client/delete-account/delete-account.component';
import { CarFilterPipe } from './pipes/car-filter.pipe';
import { ClientFilterPipe } from './pipes/client-filter.pipe';
import { ClientReceiptFilterPipe } from './pipes/client-receipt-filter.pipe';
import { ClientDetailsComponent } from './components/client/client-details/client-details.component';
import { ClientIdComponent } from './components/client/client-id/client-id.component';
import { CarDetailsComponent } from './components/cars/car-details/car-details.component';
import { CarIdComponent } from './components/cars/car-id/car-id.component';
import { ViewAllClientCarsComponent } from './components/admin/view-all-client-cars/view-all-client-cars.component';
import { ReceiptDetailsComponent } from './components/admin/receipt-details/receipt-details.component';
import { ViewMyCarsComponent } from './components/client/view-my-cars/view-my-cars.component';
import { ViewCarsComponent } from './components/client/view-cars/view-cars.component';
import { DetailsComponent } from './components/cars/details/details.component';
import { ViewMyReceiptsComponent } from './components/client/view-my-receipts/view-my-receipts.component';
import { DetailsReceiptComponent } from './components/client/details-receipt/details-receipt.component';
import { ClientReceiptDateFilterPipe } from './pipes/client-receipt-date-filter.pipe';
import { ReturnCarComponent } from './components/admin/return-car/return-car.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    HomeComponent,
    CarsComponent,
    ClientComponent,
    AdminComponent,
    LoginComponent,
    Page404Component,
    AboutComponent,
    SignupComponent,
    AudiComponent,
    BmwComponent,
    HondaComponent,
    MazdaComponent,
    MercedesComponent,
    MitsubishiComponent,
    SubaruComponent,
    ToyotaComponent,
    VolkswagenComponent,
    AddClientComponent,
    UpdateClientComponent,
    ViewClientComponent,
    ViewAllClientsComponent,
    DeleteClientComponent,
    AddCarComponent,
    UpdateCarComponent,
    ViewCarComponent,
    ViewCarByNumberComponent,
    ViewAllCarsComponent,
    DeleteCarComponent,
    ViewAllCarsByTypeComponent,
    ViewAllCarsByColorComponent,
    ViewClientCarByNumberComponent,
    ViewAllClientCarsByTypeComponent,
    ViewAllClientCarsByColorComponent,
    ViewAllClientCarsByPriceUntilComponent,
    ViewReceiptsByClientComponent,
    ViewAllReceiptsComponent,
    ViewMyBalanceComponent,
    DeleteAccountComponent,
    CarFilterPipe,
    ClientFilterPipe,
    ClientReceiptFilterPipe,
    ClientDetailsComponent,
    ClientIdComponent,
    CarDetailsComponent,
    CarIdComponent,
    ViewAllClientCarsComponent,
    ReceiptDetailsComponent,
    ViewMyCarsComponent,
    ViewCarsComponent,
    DetailsComponent,
    ViewMyReceiptsComponent,
    DetailsReceiptComponent,
    ClientReceiptDateFilterPipe,
    ReturnCarComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, FormsModule, HttpClientModule
  ],
  providers: [AuthService, AdminGuardService, ExitAdminGuardService, ClientGuardService, ExitClientGuardService, LoginService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [LayoutComponent]
})
export class AppModule { }

