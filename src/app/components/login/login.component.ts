import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ResponseCodes } from 'src/app/models/response-codes';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  @ViewChild('f', {static: false}) userLoginForm: NgForm;
  obsSubscription: Subscription = null;

  public constructor(private title: Title, private router: Router, private loginService: LoginService) { }

  public isLoggedIn: boolean;

  public ngOnInit(): void {
    this.title.setTitle("Sign In");
  }

  onSubmit() {
    let userName = this.userLoginForm.value.userName;
    let password = this.userLoginForm.value.password;
    let type = this.userLoginForm.value.type;

    this.loginService.login(userName, password, type).subscribe(res => {
        if (type === "ADMIN") { 
            this.router.navigate(["/admin"])
          if (res.status === ResponseCodes.OK) { 
              this.loginService.token = res.body; 
              localStorage.setItem("token", res.body); 
              this.loginService.setAdminUser(); 
              console.log("admin is logged in !"); 
              console.log(this.loginService.token)
          }
          else { 
            console.log(res.status); 
          }
        }
        
        if (type === "CLIENT") { 
            this.router.navigate(["/client"])
          if (res.status === ResponseCodes.OK) { 
              this.loginService.token = res.body;  
              localStorage.setItem("token", res.body);  
              this.loginService.setClientUser(); 
              console.log("client is logged in !"); 
              console.log(this.loginService.token)
            }
          else { 
            console.log(res.status); 
          }
        }
      },
      err => {
        let error: HttpErrorResponse = err;
        if (error.error === ResponseCodes.UNAUTHORIZED) { 
            console.log("unautorized!!!") 
          }
        else { 
              console.log(error.error);
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
