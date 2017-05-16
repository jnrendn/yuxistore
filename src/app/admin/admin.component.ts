import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { MdlSnackbarService, MdlDialogOutletService, MdlDialogService } from "angular2-mdl";
@Component({
  selector: 'my-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent {

  users: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  purchaseDates: FirebaseListObservable<any[]>;
  purchases: FirebaseListObservable<any[]>;
  eachPurch: any[] = [];
  acumPrice: number = 0;
  acumQuant: number = 0;
  actualUKey: any = "none";
  hide: boolean = true;



  constructor(public af: AngularFire,
    private router: Router,
    private mdlSnackbarService: MdlSnackbarService,
    public mdlDialogService: MdlDialogService) {
    this.af.auth.subscribe(auth => {

      if (auth) {
        this.getAllUsers();
        this.af.database.object(`user/${auth.uid}`).subscribe(info => {
          console.log(info.admin)
          if (info.admin == false) {
            this.router.navigateByUrl('/product');
          }
        })
      } else {
        this.router.navigateByUrl('/product');
      }
    });

  }

  getAllUsers(): void {
    this.users = this.af.database.list('/user');
  }

  userPaid(key: any): void {
    let showAlert = this.mdlDialogService.confirm('Desea continuar con el pago?', 'No', 'Si');
      showAlert.subscribe( () =>{
        this.af.database.object(`/user/${key}/purchases`).remove().then(
          (success)=>{
             this.mdlSnackbarService.showToast('Deuda borrada', 5000);
          })
      },
      (err: any) =>{
        this.mdlSnackbarService.showToast('No se ralizó el pago', 5000);
      })
  }

  onClick(){
    this.hide = !this.hide
  }

  getUserByKey(uKey: any): void {

    this.actualUKey = uKey;
    this.user = this.af.database.object(`/user/${uKey}`);
    this.af.database.list(`/user/${uKey}/purchases`).subscribe(dates => {
      this.acumPrice = 0;
      this.acumQuant = 0;
      this.eachPurch = [];
      dates.forEach(date => {
        this.purchases = this.af.database.list(`/user/${uKey}/purchases/${date.$key}`);
        this.purchases.subscribe(purch => {
          purch.forEach(item => {
            item.forEach(i => {
              this.acumPrice += (i.productPrice * i.UserproductCant);
              this.acumQuant += i.UserproductCant;
            })
          })
        })
        this.eachPurch.push({
          'date': date.$key,
          'purchases': this.purchases
        });
      })
    })
  }
}
