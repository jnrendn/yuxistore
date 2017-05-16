import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { AddproductService } from 'app/addproduct.service';
import { MdlSnackbarService, MdlDialogReference, MdlDialogService } from "angular2-mdl";
import { CreateProductComponent } from "../create-product/create-product.component";



@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  // products: FirebaseListObservable<any[]>;
  constructor(public productService: AddproductService,
    public af: AngularFire,
    public mdlSnackbarService: MdlSnackbarService,
    public dialogService: MdlDialogService,
    public router: Router) {

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.af.database.object(`user/${auth.uid}`).subscribe(info => {
          if (info.admin == false) {
            this.router.navigateByUrl('/product');
          }
        })
      } else {
        this.router.navigateByUrl('/product');
      }
    });

  }

  ngOnInit() {
  }

  snackbarSuccessUpdateProduct() {
    this.mdlSnackbarService.showSnackbar({
      message: 'Tu producto fue actualizado con exito',
      timeout: 4000
    });
  }

  snackbarFailUpdateProduct() {
    this.mdlSnackbarService.showSnackbar({
      message: 'Tu producto no pudo se actualizado',
      timeout: 4000
    });
  }

  updateProduct(key: any, price: number, quant: number) {

    if ((price != null || price != undefined) && (quant != null || quant != undefined)) {

      if (!isNaN(price) && !isNaN(quant)) {

        let result = this.dialogService.confirm('¿Seguro desea actualizar este producto?', 'No', 'Si');
        // if you need both answers
        result.subscribe(() => {
          this.af.database.object(`/products/${key}`).update({
            productCant: quant,
            productPrice: price
          }).then(
            (s) => {
              this.snackbarSuccessUpdateProduct();
            }
            ).catch(
            (err) => {
              this.snackbarFailUpdateProduct();
            })
        },
          (err: any) => {
            console.log('declined');
          }
        );



      } else {
        this.dialogService.alert('existen valores no numericos');
      }

    } else {
      this.dialogService.alert('Campos vacíos, completarlos todos');
    }

  }

  deleteProduct(key: any) {
    let result = this.dialogService.confirm('¿Seguro desea eliminar este producto?', 'No', 'Si');
    result.subscribe(() => {
      this.af.database.object(`products/${key}`).remove()
        .then((success) => {
          this.snackbarSuccessDeleteProduct();
        })
        .catch((err) => {
          this.snackbarFailDeleteProduct();
        })
    },
      (err) => {
        console.log('declined');
      })
  }

  snackbarFailDeleteProduct() {
    this.mdlSnackbarService.showSnackbar({
      message: 'El producto no se ha eliminado',
      timeout: 4000
    });
  }
  snackbarSuccessDeleteProduct() {
    this.mdlSnackbarService.showSnackbar({
      message: 'Producto eliminado con exito',
      timeout: 4000
    });
  }

  openDialog() {
    let pDialog = this.dialogService.showCustomDialog({
      component: CreateProductComponent,
      isModal: true,
      styles: { 'width': '300px', 'height': 'auto', 'max-height': '500px', 'overflow-y': 'auto' },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });
    pDialog.subscribe((dialogReference: MdlDialogReference) => {
      console.log('dialog visible', dialogReference);
    });
  }
}
