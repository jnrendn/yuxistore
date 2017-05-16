import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitUserEmail'
})
export class SplitUserEmailPipe implements PipeTransform {
  colours = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6",
            "#34495e", "#16a085", "#27ae60", "#2980b9",
            "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22",
            "#e74c3c", "#95a5a6", "#f39c12", "#d35400",
            "#c0392b", "#bdc3c7", "#7f8c8d"];



  transform(value: String, color?: boolean, id?: any): String {
    if(value != null || value != undefined){
      let nameSplit = value.split(".");
      let initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase();
      if (color) {
        let div = document.getElementById(id);
        let charIndex = initials.charCodeAt(0) - 40,
        colourIndex = charIndex % 19;
        div.style.backgroundColor =  this.colours[colourIndex]
      }
      return initials;
    }

  }

}
