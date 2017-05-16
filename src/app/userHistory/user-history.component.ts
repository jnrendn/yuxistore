import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'my-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})

export class UserHistoryComponent implements OnInit {
  userHistory: FirebaseListObservable<any[]>;
  purchases: FirebaseListObservable<any[]>;
  eachPurch: any[] = [];
  acumPrice: number = 0;
  acumQuant: number = 0;
  priceByDate: number = 0;
  arrayPriceByDate: number[] = [];
  loggedIn: boolean;

  ngOnInit() { }

  constructor(public af: AngularFire, private router: Router) {
    this.getPathProducts();
  }

  getPathProducts() {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.loggedIn = true;
        this.userHistory = this.af.database.list(`user/${auth.uid}/purchases`);
        this.userHistory.subscribe(dates => {
          this.acumPrice = 0;
          this.acumQuant = 0;
          this.eachPurch = [];
          dates.forEach(date => {
            this.purchases = this.af.database.list(`user/${auth.uid}/purchases/${date.$key}`)
            this.purchases.subscribe(purchases => {
              this.priceByDate = 0;
              purchases.forEach(purchase => {
                purchase.forEach(i => {
                  this.acumPrice += (i.productPrice * i.UserproductCant);
                  this.priceByDate += (i.productPrice * i.UserproductCant);
                  this.acumQuant += i.UserproductCant;
                })
              })
              this.arrayPriceByDate.push(this.priceByDate);
              // console.log(date.$key, this.priceByDate);
            })

            this.eachPurch.push({
              'date': date.$key,
              'purchases': this.purchases
            });
          })

        })

      } else {
        this.loggedIn = false;
      }
    });
  }
}
