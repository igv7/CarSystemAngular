import { Pipe, PipeTransform } from '@angular/core';
import { ClientReceipt } from '../models/clientReceipt';

@Pipe({
  name: 'clientReceiptFilter'
})

export class ClientReceiptFilterPipe implements PipeTransform {

  /**
   * Keeps the receipts whose client nickname, first name, last name or full name ("first last"), all
   * case-insensitive, or client identity number contains `filterBy`; returns all receipts when the filter is
   * empty. Older receipts without names or identity numbers are matched on what they have.
   */
  transform(value: ClientReceipt[], filterBy: string) : ClientReceipt[] {
   filterBy = filterBy ? filterBy.trim().toLocaleLowerCase() : null;
   return filterBy ? value.filter((clientReceipt : ClientReceipt) =>
     [clientReceipt.clientNickname, `${clientReceipt.clientFirstName || ''} ${clientReceipt.clientLastName || ''}`]
       .some(text => (text || '').toLocaleLowerCase().indexOf(filterBy) !== -1)
     || (clientReceipt.clientIdentityNumber || '').indexOf(filterBy) !== -1) : value;
  }

}
