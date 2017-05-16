import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MdlModule } from "angular2-mdl";

import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from 'environments/firebase.config';

import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { UserComponent } from './user/user.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent }  from './login/login.component';
import { ResetPasswordComponent } from './resetpassword/reset-password.component';
import { UserHistoryComponent } from './userHistory/user-history.component';
import { AdminComponent } from './admin/admin.component';
import { FooterComponent } from './footer/footer.component';


import { AddproductService } from 'app/addproduct.service';
import { AppRoutingModule } from './app-routing.module';
import { ActiveUser } from './active-user.service';
import { SplitUserEmailPipe } from './split-user-email.pipe';

import { MdlPopoverModule } from "@angular-mdl/popover";
import { InventoryComponent } from './inventory/inventory.component';
import { CreateProductComponent } from './create-product/create-product.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    CartComponent,
    UserComponent,
    SignupComponent,
    LoginComponent,
    ResetPasswordComponent,
    UserHistoryComponent,
    AdminComponent,
    FooterComponent,
    SplitUserEmailPipe,
    InventoryComponent,
    CreateProductComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MdlModule,
    MdlPopoverModule
  ],
  providers: [ AddproductService, ActiveUser ],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent, CreateProductComponent]
})
export class AppModule { }
