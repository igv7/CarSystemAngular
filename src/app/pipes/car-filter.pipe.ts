import { Pipe, PipeTransform } from '@angular/core';
import { Car } from '../models/car';

@Pipe({
  name: 'carTypeFilter'
})
export class CarFilterPipe implements PipeTransform {

  transform(value: Car[], filterBy: string) : Car[] {
   filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
   return filterBy ? value.filter((car : Car) => car.type.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
