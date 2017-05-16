import { Component, OnInit } from '@angular/core';
import { ActiveUser } from './../active-user.service';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
    selector: 'my-user',
    templateUrl: './user.component.html'
})

export class UserComponent implements OnInit{
    name:any;
    authUid:any;
    userInfo:any[] = []

    ngOnInit() {
        var colours = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6",
            "#34495e", "#16a085", "#27ae60", "#2980b9",
            "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22",
            "#e74c3c", "#95a5a6", "#f39c12", "#d35400",
            "#c0392b", "#bdc3c7", "#7f8c8d"];

        var canvas = <HTMLCanvasElement>document.getElementById('user-icon');
        var ctx = canvas.getContext('2d');
        var canvasWidth: any = canvas.getAttribute('width');
        var canvasHeight: any = canvas.getAttribute('height');
        var canvasCssWidth: any = canvasWidth;
        var canvasCssHeight: any = canvasHeight;
        var name = "";
        this.userService.userO.subscribe(u => {
            name = u.email;

            var nameSplit = name.split("."),
                initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase();

            var charIndex = initials.charCodeAt(0) - 40,
                colourIndex = charIndex % 19;

            if (window.devicePixelRatio) {
                canvas.setAttribute("width", (canvasWidth * window.devicePixelRatio).toString());
                canvas.setAttribute("height", (canvasHeight * window.devicePixelRatio).toString());
                canvas.style.height = canvasCssHeight;
                canvas.style.width = canvasCssWidth;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }

            ctx.fillStyle = colours[colourIndex];
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "50px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFF";
            ctx.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5);
        })
    }

    constructor(public af: AngularFire, private router:Router,public userService:ActiveUser) {
        this.af.auth.subscribe(auth => {
            if (auth) {
                // console.log(auth.auth.emailVerified);
              this.userInfo = [];
              this.af.database.object(`user/${auth.uid}`).subscribe( info =>{
                this.userInfo.push({
                  'name': info.name,
                  'phone': info.phone,
                  'email': info.email,
                  'lastname': info.lastname
                })
              })
            }else {
                this.router.navigateByUrl('/product');
            }
        });
    }

}
