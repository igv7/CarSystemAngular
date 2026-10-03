import { Component, OnInit } from '@angular/core';
import { ComponentCanDeactivate } from 'src/app/services/exit-client-guard.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';
import { MenuSection } from '../side-menu/side-menu.component';

/** Client dashboard at `/client`: the side menu on the left, the chosen page (a child route) on the right. */
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, ComponentCanDeactivate {

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
   * Called by ExitClientGuardService when leaving `/client`: asks for confirmation unless the page was saved
   * or someone is signed in.
   */
  canDeactivate(): boolean | Observable<boolean> {
    if (!this.saved && this.loginService.isLoggedIn == false) {
      return confirm("Are You sure You want to exit?");
    }
    else {
      return true;
    }
  }

  /** Whether a page is open; when false the overview text is shown instead. */
  public hasChild = false;

  /** The side menu: everything a client can do. */
  public readonly sections: MenuSection[] = [
    { title: 'Cars', items: [
      { label: 'View Cars', link: '/client/view-cars' },
      { label: 'View My Cars', link: '/client/view-my-cars' },
    ]},
    { title: 'My account', items: [
      { label: 'View My Receipts', link: '/client/view-my-receipts' },
      { label: 'View My Balance', link: '/client/view-my-balance' },
      { label: 'Delete Account', link: '/client/delete-account', danger: true },
    ]},
  ];

  public constructor(private title: Title, private loginService: LoginService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle("Client Page");
  }

  /** Sign Out button: asks for confirmation, then signs out and goes to /home. */
  public logout() {
    this.loginService.confirmAndSignOut();
  }

}
