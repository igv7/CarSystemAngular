import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../models/client';

@Pipe({
  name: 'clientFilter'
})
export class ClientFilterPipe implements PipeTransform {

  /**
   * Keeps the clients whose name (case-insensitive) or ClientID contains `filterBy`; returns all clients when
   * the filter is empty. Clients without a ClientID are matched by name only.
   */
  transform(value: Client[], filterBy: string): Client[] {
    filterBy = filterBy ? filterBy.trim().toLocaleLowerCase() : null;
    return filterBy ? value.filter((client : Client) =>
      (client.name || '').toLocaleLowerCase().indexOf(filterBy) !== -1
      || (client.clientID || '').indexOf(filterBy) !== -1) : value;
  }

}
