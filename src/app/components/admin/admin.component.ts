import { Component, OnInit } from '@angular/core';
import { ComponentCanDeactivate } from 'src/app/services/exit-admin-guard.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

/** Admin menu at `/admin`; each operation opens as a child route below the menu. */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, ComponentCanDeactivate {
  
  /** Set by save(); while false and nobody is signed in, leaving the page asks for confirmation. */
  saved: boolean = false;
  /**
   * Marks the page as saved so leaving it no longer asks for confirmation (not called anywhere at the
   * moment).
   */
  save() {
    this.saved = true;
  }
  /**
   * Called by ExitAdminGuardService when leaving `/admin`: asks for confirmation unless the page was saved or
   * someone is signed in.
   */
  canDeactivate(): boolean | Observable<boolean> {
    if (!this.saved && this.loginService.isLoggedIn == false) {
      return confirm("Are You sure You want to exit?");
    }
    else {
      return true;
    }
  }

  public constructor(private title: Title, private loginService: LoginService, private router: Router) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle("Admin Page");
  }

  /** Sign Out button: asks for confirmation, then signs out and goes to /home. */
  public logout() {
    this.loginService.confirmAndSignOut();
  }

  /** Opens the Add Client form. */
  public addClient() {
    this.router.navigate(["/admin/add-client"])
  }
  
  /** Opens the Update Client form. */
  public updateClient() {
    this.router.navigate(["/admin/update-client"])
  }

  /** Opens the View Client lookup. */
  public viewClient() {
    this.router.navigate(["/admin/view-client"])
  }

  /** Opens the list of all clients. */
  public viewAllClients() {
    this.router.navigate(["/admin/view-all-clients"])
  }

  /** Opens the Delete Client form. */
  public deleteClient() {
    this.router.navigate(["/admin/delete-client"])
  }

  /** Opens the Add Car form. */
  public addCar() {
    this.router.navigate(["/admin/add-car"])
  }

  /** Opens the Update Car form. */
  public updateCar() {
    this.router.navigate(["/admin/update-car"])
  }

  /** Opens the View Car lookup (by id). */
  public viewCar() {
    this.router.navigate(["/admin/view-car"])
  }

  /** Opens the View Car lookup by license plate number. */
  public viewCarByNumber() {
    this.router.navigate(["/admin/view-car-by-number"])
  }

  /** Opens the list of all cars. */
  public viewAllCars() {
    this.router.navigate(["/admin/view-all-cars"])
  }

  /** Opens the Delete Car form. */
  public deleteCar() {
    this.router.navigate(["/admin/delete-car"])
  }

  /** Opens the list of cars filtered by brand. */
  public viewAllCarsByType() {
    this.router.navigate(["/admin/view-all-cars-by-type"])
  }

  /** Opens the list of cars filtered by color. */
  public viewAllCarsByColor() {
    this.router.navigate(["/admin/view-all-cars-by-color"])
  }

  /** Opens the Return Car form. */
  public returnCar() {
    this.router.navigate(["/admin/return-car"])
  }

  /** Opens the lookup of a client's rented car by license plate number. */
  public viewClientCarByNumber() {
    this.router.navigate(["/admin/view-client-car-by-number"])
  }

  /** Opens the list of a client's rented cars. */
  public viewAllClientCars() {
    this.router.navigate(["/admin/view-all-client-cars"])
  }

  /** Opens the list of a client's rented cars filtered by brand. */
  public viewAllClientCarsByType() {
    this.router.navigate(["/admin/view-all-client-cars-by-type"])
  }

  /** Opens the list of a client's rented cars filtered by color. */
  public viewAllClientCarsByColor() {
    this.router.navigate(["/admin/view-all-client-cars-by-color"])
  }

  /** Opens the list of a client's rented cars up to a maximum price. */
  public viewAllClientCarsByPriceUntil() {
    this.router.navigate(["/admin/view-all-client-cars-by-price-until"])
  }

  /** Opens the list of one client's receipts. */
  public viewReceiptsByClient() {
    this.router.navigate(["/admin/view-receipts-by-client"])
  }

  /** Opens the list of all receipts. */
  public viewAllReceipts() {
    this.router.navigate(["/admin/view-all-receipts"])
  }

}

