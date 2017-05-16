import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { MdlDialogReference, MdlSnackbarService } from 'angular2-mdl';

import  *  as  Firebase from 'firebase';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})

export class CreateProductComponent {
  folder: string = 'images';
  prod: FirebaseListObservable<any>;
  showSpinner: boolean = false;
  productInfo = {};
  name: any = '';
  price: any = '';
  cant: any = '';
  image: any = '';

  constructor(private dialog: MdlDialogReference, private af: AngularFire, private mdlSnackbarService: MdlSnackbarService) {
    this.dialog.onHide().subscribe((product) => {
      console.log('create product dialog hidden');
      if (product) {
        console.log('create product: ', product);
      }
    })
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialog.hide();
  }


  createProduct() {
    this.showSpinner = true;
    // Create a root reference
    let storageRef = Firebase.storage().ref();
    // console.log(storageRef);
    let success = false;
    // This currently only grabs item 0, TODO refactor it to grab them all
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('file')).files[0]]) {
      console.log(selectedFile);
      if (selectedFile == undefined  || this.name == '' || this.price == '' || this.cant == '') {
        this.mdlSnackbarService.showToast('El formulario está incompleto' , 5000);
      } else {
        // Make local copies of services because "this" will be clobbered
        let af = this.af;
        let folder = this.folder;
        let path = `/${this.folder}/${selectedFile.name}`;
        var iRef = storageRef.child(path);
        iRef.put(selectedFile).then((snapshot) => {
          snapshot.ref.getDownloadURL().then(url => {
            this.image = url;
            this.showSpinner = true;
            this.productInfo['productName'] = this.name;
            this.productInfo['productPrice'] = this.price;
            this.productInfo['productCant'] = this.cant;
            this.productInfo['productImage'] = url;
            this.af.database.list(`/products`).push(this.productInfo)
              .then(() => {
                this.showSpinner = false;
                this.dialog.hide();
              }).catch(() => {
                this.showSpinner = false;
                this.dialog.hide();
              })

          });
          // console.log('Uploaded a blob or file! Now storing the reference at',`/${this.folder}/images/`);
          af.database.list(`/${folder}`).push({ path: path, filename: selectedFile.name })
        });
      }
    }
  }
}