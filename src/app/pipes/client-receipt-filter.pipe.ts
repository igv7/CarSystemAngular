import { Pipe, PipeTransform } from '@angular/core';
import { ClientReceipt } from '../models/clientReceipt';

@Pipe({
  name: 'clientReceiptFilter'
})

export class ClientReceiptFilterPipe implements PipeTransform {

  /**
   * Keeps the receipts whose client name (case-insensitive) or client identity number contains `filterBy`;
   * returns all receipts when the filter is empty. Receipts saved before identity numbers existed are matched
   * by name only.
   */
  transform(value: ClientReceipt[], filterBy: string) : ClientReceipt[] {
   filterBy = filterBy ? filterBy.trim().toLocaleLowerCase() : null;
   return filterBy ? value.filter((clientReceipt : ClientReceipt) =>
     (clientReceipt.clientName || '').toLocaleLowerCase().indexOf(filterBy) !== -1
     || (clientReceipt.clientIdentityNumber || '').indexOf(filterBy) !== -1) : value;
  }

}
