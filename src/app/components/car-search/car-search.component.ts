import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-search',
  templateUrl: './car-search.component.html',
  styleUrls: ['./car-search.component.css']
})
export class CarSearchComponent implements OnInit {

  public cars: Car[];
  public car = new Car();
  
  constructor(private carService: CarService, private router: Router) { }

  ngOnInit() {
      (<HTMLInputElement>document.querySelector('#search')).oninput = function() {
        let val = this['value'].trim().toUpperCase();
        let searchItems = document.querySelectorAll('.search a');
        if(val != '') {
          searchItems.forEach(function(elem) {
            if(elem.textContent.search(val) == -1) {
              elem.classList.add('hide');
              elem.innerHTML = elem.textContent;
            }
            else {
              elem.classList.remove('hide');
              let str = elem.textContent;
              elem.innerHTML = insertMark(str, elem.textContent.search(val), val.length);
            }
          });
        }
        else {
          searchItems.forEach(function(elem) {
            elem.classList.remove('hide');
            elem.innerHTML = elem.textContent;
        });
      }
     }
  
     function insertMark(string, pos, len) {
      return string.slice(0, pos)+'<mark>'+string.slice(pos, pos+len)+'</mark>'+string.slice(pos+len);
     }
  }

  public searchCar() {
    this.carService.getAllCarsByType(this.car.type.toUpperCase().replace(/\s/g, "")).subscribe((cars) => {
      console.log(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
      this.router.navigate([`/${this.car.type.toLowerCase().replace(/\s/g, "")}`]);
      let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
      inputSearch.value = `${this.car.type.toUpperCase()}`;
    }, err => {
      console.log(`Failed on get all Cars By Type! ${this.car.type.toUpperCase()}`+ `\n` +err.message);
      let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
      inputSearch.value = '';
      alert(`Error on get Cars By Type! ${this.car.type.toUpperCase()}` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
    });
  }

  public pastAudi() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('audi')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
      err => {
        console.log(`Failed on get Cars By Type! ${this.car.type}`+ `\n` +err.message);
        alert(`Error on view Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
      }
  }

  public pastBmw() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('bmw')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
      err => {
        console.log(`Failed on get Cars By Type! ${this.car.type}`+ `\n` +err.message);
        alert(`Error on view Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
      }
  }

  public pastHonda() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('honda')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
      err => {
        console.log(`Failed on get Cars By Type! ${this.car.type}`+ `\n` +err.message);
        alert(`Error on view Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
      }
  }

  public pastMazda() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('mazda')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
      err => {
        console.log(`Failed on get Cars By Type! ${this.car.type}`+ `\n` +err.message);
        alert(`Error on view Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
      }
  }

  public pastMercedes() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('mercedes')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
      err => {
        console.log(`Failed on get Cars By Type! ${this.car.type}`+ `\n` +err.message);
        alert(`Error on view Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
      }
  }

  public pastMitsubishi() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('mitsubishi')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
      err => {
        console.log(`Failed on get Cars By Type! ${this.car.type}`+ `\n` +err.message);
        alert(`Error on view Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
      }
  }

  public pastSubaru() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('subaru')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
      err => {
        console.log(`Failed on get Cars By Type! ${this.car.type}`+ `\n` +err.message);
        alert(`Error on view Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
      }
  }

  public pastToyota() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('toyota')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
      err => {
        console.log(`Failed on get Cars By Type! ${this.car.type}`+ `\n` +err.message);
        alert(`Error on view Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
      }
  }

  public pastVolkswagen() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('volkswagen')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
      err => {
        console.log(`Failed on get Cars By Type! ${this.car.type}`+ `\n` +err.message);
        alert(`Error on view Cars by type! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
      }
  }

}
