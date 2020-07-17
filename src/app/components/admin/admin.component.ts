import { Component, OnInit } from '@angular/core';
import { ComponentCanDeactivate } from 'src/app/services/exit-admin-guard.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, ComponentCanDeactivate {
  
  saved: boolean = false;
  save() {
    this.saved = true;
  }
  canDeactivate(): boolean | Observable<boolean> {
    if (!this.saved && this.loginService.isLoggedIn == false) {
      return confirm("Are You sure You want to exit?");
    }
    else {
      return true;
    }
  }

  public constructor(private title: Title, private loginService: LoginService, private router: Router) { }

  public ngOnInit(): void {
    this.title.setTitle("Admin Page");
  }

  public logout() {
    // this.loginService.logout();
    this.loginService.setAdminUserF();
    this.router.navigate(["/home"]);
  }

  public addClient() {
    this.router.navigate(["/admin/add-client"])
  }
  
  public updateClient() {
    this.router.navigate(["/admin/update-client"])
  }

  public viewClient() {
    this.router.navigate(["/admin/view-client"])
  }

  public viewAllClients() {
    this.router.navigate(["/admin/view-all-clients"])
  }

  public deleteClient() {
    this.router.navigate(["/admin/delete-client"])
  }

  public addCar() {
    this.router.navigate(["/admin/add-car"])
  }

  public updateCar() {
    this.router.navigate(["/admin/update-car"])
  }

  public viewCar() {
    this.router.navigate(["/admin/view-car"])
  }

  public viewCarByNumber() {
    this.router.navigate(["/admin/view-car-by-number"])
  }

  public viewAllCars() {
    this.router.navigate(["/admin/view-all-cars"])
  }

  public deleteCar() {
    this.router.navigate(["/admin/delete-car"])
  }

  public viewAllCarsByType() {
    this.router.navigate(["/admin/view-all-cars-by-type"])
  }

  public viewAllCarsByColor() {
    this.router.navigate(["/admin/view-all-cars-by-color"])
  }

  public returnCar() {
    this.router.navigate(["/admin/return-car"])
  }

  public viewClientCarByNumber() {
    this.router.navigate(["/admin/view-client-car-by-number"])
  }

  public viewAllClientCars() {
    this.router.navigate(["/admin/view-all-client-cars"])
  }

  public viewAllClientCarsByType() {
    this.router.navigate(["/admin/view-all-client-cars-by-type"])
  }

  public viewAllClientCarsByColor() {
    this.router.navigate(["/admin/view-all-client-cars-by-color"])
  }

  public viewAllClientCarsByPriceUntil() {
    this.router.navigate(["/admin/view-all-client-cars-by-price-until"])
  }

  public viewReceiptsByClient() {
    this.router.navigate(["/admin/view-receipts-by-client"])
  }

  public viewAllReceipts() {
    this.router.navigate(["/admin/view-all-receipts"])
  }

}

