import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public constructor(public loginService: LoginService) { }

  /** Sign Out link: asks for confirmation, then signs out and goes to /home. */
  public logout(): void {
    this.loginService.confirmAndSignOut();
  }

  ngOnInit(): void {
  }

}
