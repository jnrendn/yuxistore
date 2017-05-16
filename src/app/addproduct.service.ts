// import { Injectable } from '@angular/core';
// import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

// @Injectable()
// export class AddproductService {
//     products: FirebaseListObservable<any[]>;
//     list_added_products = [];
//     enableBuyButton = false;
//     totalItemsIncart: number = 0;

//     constructor(public af: AngularFire) {
//         this.products = this.af.database.list('/products');
//     }

//     addProduct(new_product: any): void {
//         /* TODO: calculate total purchase price
//         */

//         var existProd = false;
//         /* this boolean variable turn to true if the poduct is already added to list,
//         * if the product doesn't exist the existProd variable keeps its value in false
//         */

//         //By default we set UserproductCant in one when user adds a new product
//         new_product['UserproductCant'] = 1;

//         //Ensure if this.list_added_products array variable has products to iterate it
//         if (this.list_added_products.length != 0) {

//             for (var i = 0; i < this.list_added_products.length; i++) {
//                 /*start looping through this.list_added_products to verify whether
//                 * new comming product exist in this.list_added_products to turn existProd to true
//                 */
//                 if (this.list_added_products[i].$key == new_product.$key) {
//                     existProd = true;
//                     break;
//                 }
//             }
//             if (!existProd) {
//                 // if the new product comming doesn't exist in list_added_products,
//                 // this product is pushed into list_added_products array
//                 this.list_added_products.push(new_product);
//             } else {

//                 /**
//                 * if the product already exist into list_added_products find this product in
//                 * list_added_products to add one unit to UserproductCant
//                 */
//                 if (this.list_added_products[i].productCant > this.list_added_products[i].UserproductCant) {
//                     this.list_added_products[i].UserproductCant = this.list_added_products[i].UserproductCant + 1;
//                 }
//             }
//         } else {
//             /* If there is not products added into list_added_products
//             * just new product comming as fist one
//             */
//             this.list_added_products.push(new_product);
//         }
//         this.calculateNumberOfitemsIncart();
//     }

//     // This method allow us to delete a selected product from list_added_product array
//     unlistproduct(index: number): void {
//         this.list_added_products.splice((index), 1);
//         this.calculateNumberOfitemsIncart();
//     }

//     calculateNumberOfitemsIncart(): void {
//         this.totalItemsIncart = 0;
//         for (let i = 0; i < this.list_added_products.length; i++) {
//             this.totalItemsIncart += this.list_added_products[i].UserproductCant;
//         }
//     }
// }
import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class AddproductService {
    products: FirebaseListObservable<any[]>;
    list_added_products = [];
    enableBuyButton = false;
    totalItemsIncart: number = 0;

    constructor(public af: AngularFire) {
        this.products = this.af.database.list('/products');
    }

    addProduct(new_product: any): void {
        /* TODO: calculate total purchase price
        */

        var existProd = false;
        /* this boolean variable turn to true if the poduct is already added to list,
        * if the product doesn't exist the existProd variable keeps its value in false
        */

        //By default we set UserproductCant in one when user adds a new product
        new_product['UserproductCant'] = 1;

        //Ensure if this.list_added_products array variable has products to iterate it
        if (this.list_added_products.length != 0) {

            for (var i = 0; i < this.list_added_products.length; i++) {
                /*start looping through this.list_added_products to verify whether
                * new comming product exist in this.list_added_products to turn existProd to true
                */
                if (this.list_added_products[i].$key == new_product.$key) {
                    existProd = true;
                    break;
                }
            }
            if (!existProd) {
                // if the new product comming doesn't exist in list_added_products,
                // this product is pushed into list_added_products array
                this.list_added_products.push(new_product);
            } else {

                /**
                * if the product already exist into list_added_products find this product in
                * list_added_products to add one unit to UserproductCant
                */
                if (this.list_added_products[i].productCant > this.list_added_products[i].UserproductCant) {
                    this.list_added_products[i].UserproductCant = this.list_added_products[i].UserproductCant + 1;
                }
            }
        } else {
            /* If there is not products added into list_added_products
            * just new product comming as fist one
            */
            this.list_added_products.push(new_product);
        }
        this.calculateNumberOfitemsIncart();
    }

    // This method allow us to delete a selected product from list_added_product array
    unlistproduct(index: number): void {
        this.list_added_products.splice((index), 1);
        this.calculateNumberOfitemsIncart();
    }

    calculateNumberOfitemsIncart(): void {
        this.totalItemsIncart = 0;
        for (let i = 0; i < this.list_added_products.length; i++) {
            this.totalItemsIncart += this.list_added_products[i].UserproductCant;
        }
    }
}
