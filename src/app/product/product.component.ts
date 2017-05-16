import { Component, OnInit } from '@angular/core';
import { AddproductService } from 'app/addproduct.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    // This variable host
    product_selected: any;
    products: FirebaseListObservable<any[]>;

    constructor(public productService: AddproductService, public af:AngularFire) { }

    ngOnInit() {
        this.products = this.getProducts();
    }

    getProducts(): FirebaseListObservable<any[]> {
        return this.af.database.list('/products');
    }

    addProductToCart(key: any): void {
        this.productService.products.subscribe(list => {
          list.forEach(prod => {
            if(prod.$key == key){
              this.product_selected = prod
            }
          })
        })
        this.productService.addProduct(this.product_selected);
    }
}
