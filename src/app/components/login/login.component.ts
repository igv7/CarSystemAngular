import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
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


  /** The sign-in form; its values are read on submit. */
  @ViewChild('f', {static: false}) userLoginForm: NgForm;
  /** Never assigned, so ngOnDestroy has nothing to unsubscribe. */
  obsSubscription: Subscription = null;

  private log = this.logger.for('LoginComponent');

  public constructor(private title: Title, private router: Router, private route: ActivatedRoute, private loginService: LoginService, private logger: LoggerService) { }

  /** Not used; the sign-in state lives in LoginService. */
  public isLoggedIn: boolean;

  /** Opened from the Client page (`/login?as=client`): only the CLIENT type is allowed. */
  public clientOnly = false;

  /** The typed username; decides whether the type can be chosen. */
  public userName = '';

  /** The selected type, bound to the Type field. */
  public type = 'CLIENT';

  /** Only the admin account, and not from the Client page, may choose its type; everyone else is a CLIENT. */
  public get canChooseType(): boolean {
    return !this.clientOnly && this.userName.trim() === environment.adminUserName;
  }

  /** Sets the browser tab title and reads where Sign In was opened from (it can change while on this page). */
  public ngOnInit(): void {
    this.title.setTitle("Sign In");
    this.queryParams = this.route.queryParamMap.subscribe(params => {
      this.clientOnly = params.get('as') === 'client';
      this.applyTypeRule(params.get('as') === 'admin' ? 'ADMIN' : 'CLIENT');
    });
  }

  /** Username input changed: unlock the type for the admin account (preselecting ADMIN), lock it otherwise. */
  public onUserNameChange(value: string): void {
    const couldChoose = this.canChooseType;
    this.userName = value || '';
    if (this.canChooseType !== couldChoose) {
      this.applyTypeRule('ADMIN');
    }
  }

  /** Reset button: the form clears its fields first, then this puts back the matching type. */
  public onReset(): void {
    setTimeout(() => {
      this.userName = '';
      this.applyTypeRule('CLIENT');
    });
  }

  /** Forces CLIENT when the type can't be chosen; otherwise uses `preferred`. */
  private applyTypeRule(preferred: string): void {
    this.type = this.canChooseType ? preferred : 'CLIENT';
  }

  private queryParams: Subscription;

  /**
   * Signs in with the form values. Opens /admin or /client by the chosen type, and on success stores the
   * token and role flag.
   */
  onSubmit() {
    let userName = this.userLoginForm.value.userName;
    let password = this.userLoginForm.value.password;
    // Read from the field, not the form: a locked (disabled) Type field is left out of the form's values.
    let type = this.canChooseType ? this.type : 'CLIENT';
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

  /** Stops watching the URL; also unsubscribes and clears the token if a subscription was stored. */
  ngOnDestroy(): void {
    if (this.queryParams) {
      this.queryParams.unsubscribe();
    }
    if (this.obsSubscription != null) {
      this.obsSubscription.unsubscribe();
      this.loginService.token = null;
    }
  }

  /** Cancel button: leaves the form and returns to /home. */
  public cancel() {
    this.router.navigate(["/home"])
  }

  /** Close (×) button: leaves the form and returns to /home. */
  public close() {
    this.router.navigate(["/home"])
  }

}
