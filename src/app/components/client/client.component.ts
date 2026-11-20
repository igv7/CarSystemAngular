import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';
import { MenuSection } from '../side-menu/side-menu.component';
import { PageTitles } from 'src/app/constants/page-titles';
import { AppRoutes } from 'src/app/constants/app-routes';
import { StorageKeys } from 'src/app/constants/storage-keys';

/** Client dashboard at `/client`: the side menu on the left, the chosen page (a child route) on the right. */
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  /** Whether a page is open; when false the overview text is shown instead. */
  public hasChild = false;

  /** Link of the menu's Overview item. */
  public readonly homeLink = AppRoutes.CLIENT;

  /** localStorage key under which the menu remembers its collapsed sections. */
  public readonly menuStorageKey = StorageKeys.CLIENT_MENU_COLLAPSED;

  /** The side menu: everything a client can do. */
  public readonly sections: MenuSection[] = [
    { title: 'Cars', items: [
      { label: 'View Cars', link: AppRoutes.CLIENT_VIEW_CARS },
      { label: 'View My Cars', link: AppRoutes.CLIENT_VIEW_MY_CARS },
    ]},
    { title: 'My account', items: [
      { label: 'View My Receipts', link: AppRoutes.CLIENT_VIEW_MY_RECEIPTS },
      { label: 'View My Balance', link: AppRoutes.CLIENT_VIEW_MY_BALANCE },
      { label: 'Delete Account', link: AppRoutes.CLIENT_DELETE_ACCOUNT, danger: true },
    ]},
  ];

  /** Name shown in the overview's greeting; null for a session signed in before names were stored. */
  public get userName(): string {
    return this.loginService.getUserName();
  }

  public constructor(private title: Title, private loginService: LoginService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle(PageTitles.CLIENT);
  }

  /** Sign Out button: asks for confirmation, then signs out and goes to /home. */
  public logout() {
    this.loginService.confirmAndSignOut();
  }

}
