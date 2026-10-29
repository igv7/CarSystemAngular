import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { AppRoutes } from 'src/app/constants/app-routes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  /** Route links used by the template. */
  public readonly routes = AppRoutes;

  public constructor(public loginService: LoginService) { }

  /** Sign Out link: asks for confirmation, then signs out and goes to /home. */
  public logout(): void {
    this.loginService.confirmAndSignOut();
  }

  ngOnInit(): void {
  }

}
