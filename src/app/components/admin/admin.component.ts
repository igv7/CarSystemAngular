import { Component, OnInit } from '@angular/core';
import { ComponentCanDeactivate } from 'src/app/services/exit-admin-guard.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';
import { MenuSection } from '../side-menu/side-menu.component';

/** Admin dashboard at `/admin`: the side menu on the left, the chosen operation (a child route) on the right. */
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

  /** Whether an operation is open; when false the overview text is shown instead. */
  public hasChild = false;

  /** The side menu: every admin operation, grouped by what it works on. */
  public readonly sections: MenuSection[] = [
    { title: 'Clients', items: [
      { label: 'Add Client', link: '/admin/add-client' },
      { label: 'Update Client', link: '/admin/update-client' },
      { label: 'View Client', link: '/admin/view-client' },
      { label: 'View All Clients', link: '/admin/view-all-clients' },
      { label: 'Delete Client', link: '/admin/delete-client', danger: true },
    ]},
    { title: 'Cars', items: [
      { label: 'Add Car', link: '/admin/add-car' },
      { label: 'Update Car', link: '/admin/update-car' },
      { label: 'View Car', link: '/admin/view-car' },
      { label: 'View Car By Number', link: '/admin/view-car-by-number' },
      { label: 'View All Cars', link: '/admin/view-all-cars' },
      { label: 'View All Cars By Type', link: '/admin/view-all-cars-by-type' },
      { label: 'View All Cars By Color', link: '/admin/view-all-cars-by-color' },
      { label: 'Return Car', link: '/admin/return-car', danger: true },
      { label: 'Delete Car', link: '/admin/delete-car', danger: true },
    ]},
    { title: 'Client cars', items: [
      { label: 'View Client Car By Number', link: '/admin/view-client-car-by-number' },
      { label: 'View All Client Cars', link: '/admin/view-all-client-cars' },
      { label: 'Client Cars By Type', link: '/admin/view-all-client-cars-by-type' },
      { label: 'Client Cars By Color', link: '/admin/view-all-client-cars-by-color' },
      { label: 'Client Cars By Price', link: '/admin/view-all-client-cars-by-price-until' },
    ]},
    { title: 'Receipts', items: [
      { label: 'View Receipts By Client', link: '/admin/view-receipts-by-client' },
      { label: 'View All Receipts', link: '/admin/view-all-receipts' },
    ]},
  ];

  public constructor(private title: Title, private loginService: LoginService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle("Admin Page");
  }

  /** Sign Out button: asks for confirmation, then signs out and goes to /home. */
  public logout() {
    this.loginService.confirmAndSignOut();
  }

}
