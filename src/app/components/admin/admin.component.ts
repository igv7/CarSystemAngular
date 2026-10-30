import { Component, OnInit } from '@angular/core';
import { ComponentCanDeactivate } from 'src/app/services/exit-admin-guard.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';
import { MenuSection } from '../side-menu/side-menu.component';
import { PageTitles } from 'src/app/constants/page-titles';
import { AppRoutes } from 'src/app/constants/app-routes';
import { StorageKeys } from 'src/app/constants/storage-keys';

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

  /** Link of the menu's Overview item. */
  public readonly homeLink = AppRoutes.ADMIN;

  /** localStorage key under which the menu remembers its collapsed sections. */
  public readonly menuStorageKey = StorageKeys.ADMIN_MENU_COLLAPSED;

  /** The side menu: every admin operation, grouped by what it works on. */
  public readonly sections: MenuSection[] = [
    { title: 'Clients', items: [
      { label: 'Add Client', link: AppRoutes.ADMIN_ADD_CLIENT },
      { label: 'Update Client', link: AppRoutes.ADMIN_UPDATE_CLIENT },
      { label: 'View Client By ID', link: AppRoutes.ADMIN_VIEW_CLIENT },
      { label: 'View Client By Identity Number', link: AppRoutes.ADMIN_VIEW_CLIENT_BY_CLIENT_ID },
      { label: 'View All Clients', link: AppRoutes.ADMIN_VIEW_ALL_CLIENTS },
      { label: 'Delete Client', link: AppRoutes.ADMIN_DELETE_CLIENT, danger: true },
    ]},
    { title: 'Cars', items: [
      { label: 'Add Car', link: AppRoutes.ADMIN_ADD_CAR },
      { label: 'Update Car', link: AppRoutes.ADMIN_UPDATE_CAR },
      { label: 'View Car', link: AppRoutes.ADMIN_VIEW_CAR },
      { label: 'View Car By Number', link: AppRoutes.ADMIN_VIEW_CAR_BY_NUMBER },
      { label: 'View All Cars', link: AppRoutes.ADMIN_VIEW_ALL_CARS },
      { label: 'View All Cars By Type', link: AppRoutes.ADMIN_VIEW_ALL_CARS_BY_TYPE },
      { label: 'View All Cars By Color', link: AppRoutes.ADMIN_VIEW_ALL_CARS_BY_COLOR },
      { label: 'Return Car', link: AppRoutes.ADMIN_RETURN_CAR, danger: true },
      { label: 'Delete Car', link: AppRoutes.ADMIN_DELETE_CAR, danger: true },
    ]},
    { title: 'Client cars', items: [
      { label: 'View Client Car By Number', link: AppRoutes.ADMIN_VIEW_CLIENT_CAR_BY_NUMBER },
      { label: 'View All Client Cars', link: AppRoutes.ADMIN_VIEW_ALL_CLIENT_CARS },
      { label: 'Client Cars By Type', link: AppRoutes.ADMIN_VIEW_ALL_CLIENT_CARS_BY_TYPE },
      { label: 'Client Cars By Color', link: AppRoutes.ADMIN_VIEW_ALL_CLIENT_CARS_BY_COLOR },
      { label: 'Client Cars By Price', link: AppRoutes.ADMIN_VIEW_ALL_CLIENT_CARS_BY_PRICE_UNTIL },
    ]},
    { title: 'Receipts', items: [
      { label: 'View Receipts By Client', link: AppRoutes.ADMIN_VIEW_RECEIPTS_BY_CLIENT },
      { label: 'View All Receipts', link: AppRoutes.ADMIN_VIEW_ALL_RECEIPTS },
    ]},
  ];

  /** Name shown in the overview's greeting; null for a session signed in before names were stored. */
  public get userName(): string {
    return this.loginService.getUserName();
  }

  public constructor(private title: Title, private loginService: LoginService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle(PageTitles.ADMIN);
  }

  /** Sign Out button: asks for confirmation, then signs out and goes to /home. */
  public logout() {
    this.loginService.confirmAndSignOut();
  }

}
