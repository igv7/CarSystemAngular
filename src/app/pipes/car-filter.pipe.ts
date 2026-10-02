import { Pipe, PipeTransform } from '@angular/core';
import { Car } from '../models/car';

@Pipe({
  name: 'carTypeFilter'
})
export class CarFilterPipe implements PipeTransform {

  /**
   * Keeps the cars whose type contains `filterBy` (case-insensitive); returns all cars when the filter is
   * empty.
   */
  transform(value: Car[], filterBy: string) : Car[] {
   filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
   return filterBy ? value.filter((car : Car) => car.type.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
