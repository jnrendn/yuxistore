import { Injectable } from '@angular/core';
import { FirebaseListObservable, AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Injectable()

export class ActiveUser {
    user: any[] = [];
    userO: FirebaseObjectObservable<any>;
    isAdmin: boolean = false;
    isLoggedIn: boolean = false;

    constructor(public af: AngularFire, ) {
        this.af.auth.subscribe(auth => {
            if (auth) {
                this.isLoggedIn = true;
                this.userO = this.af.database.object(`user/${auth.uid}`);
                this.userO.subscribe(a => {
                    if(a.admin){
                        this.isAdmin = true;
                    }
                })
            }
        })
    }

}
