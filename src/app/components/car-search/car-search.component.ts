import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger.service';

/** Brand search box in the header, with a dropdown of brand suggestions. */
@Component({
  selector: 'app-car-search',
  templateUrl: './car-search.component.html',
  styleUrls: ['./car-search.component.css']
})
export class CarSearchComponent implements OnInit {

  /** Cars shown in the table; undefined (loading picture shown) until the server responds. */
  public cars: Car[];
  /** Search form model; `type` holds the typed brand. */
  public car = new Car();
  
  private log = this.logger.for('CarSearchComponent');

  constructor(private carService: CarService, private router: Router, private logger: LoggerService) { }

  /**
   * Wires up the search box: while typing, hides suggestions that don't match and highlights the matching
   * part of the rest.
   */
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

  /** Loads the cars of the typed brand and opens that brand's page; alerts if the brand has no cars. */
  public searchCar() {
    this.carService.getAllCarsByType(this.car.type.toUpperCase().replace(/\s/g, "")).subscribe((cars) => {
      this.log.debug(`Success! `,this.cars = cars);
      setTimeout(() => this.cars = cars, 1000);
      this.router.navigate([`/${this.car.type.toLowerCase().replace(/\s/g, "")}`]);
      let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
      inputSearch.value = `${this.car.type.toUpperCase()}`;
    }, err => {
      this.log.error(`Failed on get all Cars By Type! ${this.car.type.toUpperCase()}`, err);
      let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
      inputSearch.value = '';
      alert(`Error on get Cars By Type! ${this.car.type.toUpperCase()}` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No cars by type: ${this.car.type}`);
    });
  }

  /** Puts the clicked suggestion ("AUDI") into the search box; the link itself opens the brand page. */
  public pastAudi() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('audi')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
  }

  /** Puts the clicked suggestion ("BMW") into the search box; the link itself opens the brand page. */
  public pastBmw() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('bmw')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
  }

  /** Puts the clicked suggestion ("HONDA") into the search box; the link itself opens the brand page. */
  public pastHonda() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('honda')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
  }

  /** Puts the clicked suggestion ("MAZDA") into the search box; the link itself opens the brand page. */
  public pastMazda() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('mazda')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
  }

  /** Puts the clicked suggestion ("MERCEDES") into the search box; the link itself opens the brand page. */
  public pastMercedes() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('mercedes')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
  }

  /** Puts the clicked suggestion ("MITSUBISHI") into the search box; the link itself opens the brand page. */
  public pastMitsubishi() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('mitsubishi')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
  }

  /** Puts the clicked suggestion ("SUBARU") into the search box; the link itself opens the brand page. */
  public pastSubaru() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('subaru')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
  }

  /** Puts the clicked suggestion ("TOYOTA") into the search box; the link itself opens the brand page. */
  public pastToyota() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('toyota')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
  }

  /** Puts the clicked suggestion ("VOLKSWAGEN") into the search box; the link itself opens the brand page. */
  public pastVolkswagen() {
    let inputSearch = (<HTMLInputElement>document.querySelector('#search'));
    let inp = (<HTMLInputElement>document.getElementById('volkswagen')).textContent;
    this.car.type = inp;
    inputSearch.value = this.car.type;
  }

}
