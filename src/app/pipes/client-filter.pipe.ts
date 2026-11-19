import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../models/client';

@Pipe({
  name: 'clientFilter'
})
export class ClientFilterPipe implements PipeTransform {

  /**
   * Keeps the clients whose nickname, first name, last name or full name ("first last"), all case-insensitive,
   * or ClientID contains `filterBy`; returns all clients when the filter is empty.
   */
  transform(value: Client[], filterBy: string): Client[] {
    filterBy = filterBy ? filterBy.trim().toLocaleLowerCase() : null;
    return filterBy ? value.filter((client : Client) =>
      [client.nickname, `${client.firstName || ''} ${client.lastName || ''}`]
        .some(text => (text || '').toLocaleLowerCase().indexOf(filterBy) !== -1)
      || (client.clientID || '').indexOf(filterBy) !== -1) : value;
  }

}
