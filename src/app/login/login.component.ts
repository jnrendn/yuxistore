import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

import { MdlSnackbarService } from "angular2-mdl";

import { MdlDialogReference } from "angular2-mdl";
import * as Firebase from 'firebase';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
    state: string = '';
    error: any;
    showSpinner: boolean = false;
    userInfo = { }
    // Login info
    username: any = '';
    password: any = '';

    // Sign Up  Info
    email: string;
    pwd: string;
    pwd_r: string;
    fullname: string;
    phone: string;
    noMatch: boolean = false;

    // Reset Password
    email_rec: string;
    resetMessage: any;


    Login: boolean = true;
    Register: boolean = false;
    Reset: boolean = false;

    constructor(public af: AngularFire,
                private router: Router,
                public dialog: MdlDialogReference,
                private mdlSnackbarService: MdlSnackbarService
              ) {
        this.dialog.onHide().subscribe((user) => {
            if (user) {
                console.log('authenticated user', user);
            }
        })
    }


    @HostListener('keydown.esc')
    public onEsc(): void {
        this.dialog.hide();
    }


    login() {
      this.showSpinner = true;
        this.error = "";
        this.af.auth.login({
                email: this.username,
                password: this.password
            },
                {
                    provider: AuthProviders.Password,
                    method: AuthMethods.Password,
                }).then(
                (success) => {
                  this.showSpinner = false;
                    this.dialog.hide();
                    if (success.auth.emailVerified) {
                        this.af.database.object(`user/${success.auth.uid}`).subscribe(item => {
                            if (item.admin) {
                                this.router.navigateByUrl('/')
                            } else {
                                this.router.navigateByUrl('/');
                            }
                        })

                    } else {
                      this.showSpinner = false;
                        // this.error =
                        this.mdlSnackbarService.showToast("This user has not email verified", 5000);
                        this.af.auth.logout().then(() => {
                          // console.log('logged out');
                          this.mdlSnackbarService.showToast("You cannot Login");
                        })
                    }


                }).catch(
                (err) => {
                  this.showSpinner = false;
                    this.error = err;
                })
    }

    showRegister() {
      this.Login = false;
      this.Register = true;
      this.Reset = false;
    }


    signUp() {
        if(this.validateEmail(this.email)==true){
          if(this.pwd == this.pwd_r){
            this.userInfo['email'] = this.email;
            this.userInfo['name'] = this.fullname;
            this.userInfo['phone'] = this.phone;
            this.userInfo['admin'] = false;

            this.af.auth.createUser({
              email: this.email,
              password: this.pwd
            }).then(
              (success) => {
                this.af.auth.subscribe( auth => {
                  if(auth){
                    this.af.auth.logout();
                  }
                })
                success.auth.sendEmailVerification().then(
                  () => {
                    this.af.database.object(`/user/${success.auth.uid}`).set(this.userInfo);
                    this.mdlSnackbarService.showToast("We've sent you a confirmation email to: " + success.auth.email, 6000);

                  }).catch(
                  (err) => {
                    console.error(err)
                  })
              }
            )
              .catch(
                (err) => {
                  console.error(err);
                  this.error = err;
                })
              }else{
                this.noMatch = true;
                // alert("password don't match")
                this.mdlSnackbarService.showToast("password don't match", 5000);
              }
            }else {
              // alert("invalid email");
              this.mdlSnackbarService.showToast("Invalid email", 5000);
            }

  }

  validateEmail(email:any):boolean{
    let splitted = email.match("^(.+)@yuxiglobal\.com$");
    if(splitted == null){
      return false
    }
    if(splitted[1]!=null){
      let user =  /^\"?[\w-_\.]*\"?$/;
      if (splitted[1].match(user) == null) return false;
      return true;
    }
    return false;
  }

    showReset() {
      this.Login = false;
      this.Register = false;
      this.Reset = true;
    }

    showLogin() {
      this.Login = true;
      this.Register = false;
      this.Reset = false;
    }

    resetPassword() {
        Firebase.auth().sendPasswordResetEmail(this.email_rec).then((success) => {
        console.log(success);
        // this.resetMessage = "we've sent you an email of password reset";
        this.mdlSnackbarService.showToast("we've sent you an email of password reset", 7000);
      })
        .catch(
        (err) => {
          console.log(err);
          this.resetMessage = err;
        })
    }

}
