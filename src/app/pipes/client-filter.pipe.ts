import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../models/client';

@Pipe({
  name: 'clientFilter'
})
export class ClientFilterPipe implements PipeTransform {

  /**
   * Keeps the clients whose name contains `filterBy` (case-insensitive); returns all clients when the filter
   * is empty.
   */
  transform(value: Client[], filterBy: string): Client[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filterBy ? value.filter((client : Client) => client.name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
