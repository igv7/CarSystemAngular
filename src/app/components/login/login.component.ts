import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ResponseCodes } from 'src/app/models/response-codes';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  @ViewChild('f', {static: false}) userLoginForm: NgForm;
  obsSubscription: Subscription = null;

  private log = this.logger.for('LoginComponent');

  public constructor(private title: Title, private router: Router, private loginService: LoginService, private logger: LoggerService) { }

  public isLoggedIn: boolean;

  public ngOnInit(): void {
    this.title.setTitle("Sign In");
  }

  onSubmit() {
    let userName = this.userLoginForm.value.userName;
    let password = this.userLoginForm.value.password;
    let type = this.userLoginForm.value.type;
    this.log.debug(`Login attempt for ${userName} (${type})`);

    this.loginService.login(userName, password, type).subscribe(res => {
        if (type === "ADMIN") { 
            this.router.navigate(["/admin"])
          if (res.status === ResponseCodes.OK) { 
              this.loginService.token = res.body; 
              localStorage.setItem("token", res.body); 
              this.loginService.setAdminUser(); 
              this.log.info(`Admin ${userName} logged in`);
          }
          else { 
            this.log.error(`Unexpected login response status for ${userName} (${type})`, res.status);
          }
        }
        
        if (type === "CLIENT") { 
            this.router.navigate(["/client"])
          if (res.status === ResponseCodes.OK) { 
              this.loginService.token = res.body;  
              localStorage.setItem("token", res.body);  
              this.loginService.setClientUser(); 
              this.log.info(`Client ${userName} logged in`);
            }
          else { 
            this.log.error(`Unexpected login response status for ${userName} (${type})`, res.status);
          }
        }
      },
      err => {
        let error: HttpErrorResponse = err;
        if (error.error === ResponseCodes.UNAUTHORIZED) { 
            this.log.error(`Login unauthorized for ${userName} (${type})`, error);
          }
        else { 
              this.log.error(`Login failed for ${userName} (${type})`, error);
              alert(`Wrong details! Check Your Sign In form!`);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.obsSubscription != null) {
      this.obsSubscription.unsubscribe();
      this.loginService.token = null;
    }
  }

  public cancel() {
    this.router.navigate(["/home"])
  }

  public close() {
    this.router.navigate(["/home"])
  }

}
