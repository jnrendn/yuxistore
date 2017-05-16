import { Component, OnInit } from '@angular/core';
import { AddproductService } from 'app/addproduct.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { MdlSnackbarService } from "angular2-mdl";

import { LoginComponent } from "../login/login.component";
import { MdlDialogService } from "angular2-mdl";
import { MdlDialogReference } from "angular2-mdl";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  authuser: any;
  purchases: FirebaseListObservable<any[]>;
  product_selected: any;
  result: FirebaseListObservable<any[]>;
  date: any;
  num: any; MdlDialogReference

  constructor(public productService: AddproductService,
    public af: AngularFire,
    private mdlSnackbarService: MdlSnackbarService,
    public dialog: MdlDialogService) {

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.productService.enableBuyButton = true;
        this.authuser = auth.uid;
      } else {
        this.productService.enableBuyButton = false;
      }
    });
    console.log(this.authuser);
  }

  addtocart(e: any) {
    this.productService.addProduct(e);
  }

  showSnackbar() {
    this.mdlSnackbarService.showSnackbar({
      message: 'Thanks for your purchase :)',
      timeout: 5000
    });
  }

  showLoginSnackbar() {
    this.mdlSnackbarService.showSnackbar({
      message: 'You must be logged in to make a purchase',
      timeout: 5000
    });
  }

  showAlert() {

    let pDialog = this.dialog.showCustomDialog({
      component: LoginComponent,
      isModal: true,
      styles: { 'width': '300px', 'height': 'auto', 'max-height': '400px', 'overflow-y': 'auto' },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });

    pDialog.subscribe((dialogReference: MdlDialogReference) => {
      console.log('dialog visible', dialogReference);
    });
  }

  ngOnInit() { }

  unlistProduct(index: number): void {
    this.productService.unlistproduct(index);
  }

  lessOneProduct(key: any) {

    for (var i = 0; i < this.productService.list_added_products.length; i++) {
      if (this.productService.list_added_products[i].$key === key) {
        if (this.productService.list_added_products[i].UserproductCant == 1) {
            this.unlistProduct(i);
        } else {
          this.productService.list_added_products[i].UserproductCant -= 1;
        }
        break;
      }
    }

    this.productService.calculateNumberOfitemsIncart();
  }

  addProductToCart(key: any): void {
    this.productService.products.subscribe(list => {
      list.forEach(prod => {
        if (prod.$key == key) {
          this.product_selected = prod
        }
      })
    })
    this.productService.addProduct(this.product_selected);
  }




  submitPurchase(): void {
    if (this.productService.enableBuyButton) {

      /*
* get today's date to register the purchase in correct date, it helps us
* to organize puchases by date to each user into Firebase Database
*/
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      this.date = dd + "-" + mm + "-" + yyyy;

      var productsCantBuy = [];
      var realQuantities: any[] = [];

      this.purchases = this.af.database.list(`user/${this.authuser}/purchases/${this.date}`);

      this.productService.list_added_products.forEach(cartItem => {
        this.productService.products.forEach(observableItem => {
          observableItem.forEach(p => {
            if (cartItem.$key == p.$key) {
              if (cartItem.UserproductCant > p.productCant) {
                productsCantBuy.push({
                  'product': cartItem.productName,
                  'realQuant': p.productCant
                })
              }
            }
          })
        })
      })

      if (productsCantBuy.length == 0) {

        this.purchases.push(this.productService.list_added_products).then(
          (data) => {
            for (var i = 0; i < this.productService.list_added_products.length; i++) {
              this.af.database.list('/products').update(
                this.productService.list_added_products[i].$key,
                { productCant: (this.productService.list_added_products[i].productCant - this.productService.list_added_products[i].UserproductCant) }
              ).then(
                (res) => {
                  this.productService.list_added_products = [];
                  this.productService.calculateNumberOfitemsIncart();
                  this.showSnackbar()
                }).catch(
                (err) => {
                  console.log(err);
                })
            }
          }).catch(
          (err) => {
            console.log(err);
          });

      } else {
        for (let i = 0; i < productsCantBuy.length; i++) {
          alert(productsCantBuy[i].product + " doesn't have enough stock, please make sure abount" +
            "amount to buy, please buy less than or equal to" + productsCantBuy[i].realQuant);
        }
      }

    } else {
      this.showAlert();
    }

  }
}
