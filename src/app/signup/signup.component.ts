import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';


@Component({
    selector: 'my-signup',
    templateUrl: './signup.component.html',
    styleUrls: [ './signup.component.css' ]
})

export class SignupComponent {

    noMatch: boolean = false;
    state: string = '';
    error: any;
    user = { };

    constructor(public af:AngularFire, private router: Router) { 
      // this.af.auth.subscribe(auth => {
      //       if(auth || auth.auth.emailVerified){
      //           this.router.navigateByUrl('/product');
      //       }
      //   });
    }

      onSubmit(formData) {
        if(formData.valid) {
          if(this.validateEmail(formData.value.email)==true){
            if(formData.value.password == formData.value.pass){
              this.user['email'] = formData.value.email;
              this.user['name'] = formData.value.name;
              this.user['phone'] = formData.value.phone;
              this.user['admin'] = false;

              this.af.auth.createUser({
                email: formData.value.email,
                password: formData.value.password
              }).then(
                (success) => {
                  this.af.auth.subscribe( auth => {
                    if(auth){
                      this.af.auth.logout();
                    }
                  })
                  success.auth.sendEmailVerification().then( 
                    () => { 
                      this.af.database.object(`/user/${success.auth.uid}`).set(this.user);
                      window.alert("We've sent you a confirmation email to: " + success.auth.email);
                      
                      formData.reset();
                    }).catch( 
                    (err) => {
                      console.error(err)
                    })
                }
              )

              // .then(
              //   (success) => {
              //     this.af.database.object(`/user/${success.auth.uid}`).set(this.user);
              //     console.log(success);
              //     this.af.auth.subscribe(auth => {
              //       if(auth) {
              //         this.router.navigateByUrl('/user');
              //       }
              //     });
              //   })

                .catch(
                  (err) => {
                    console.error(err);
                    this.error = err;
                  })
                }else{
                  this.noMatch = true;
                  alert("password don't match")
                }
              }else {
                alert("invalid email");
              }
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


 }
