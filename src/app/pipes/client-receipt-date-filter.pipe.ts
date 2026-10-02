import { Pipe, PipeTransform } from '@angular/core';
import { ClientReceipt } from '../models/clientReceipt';

@Pipe({
  name: 'clientReceiptDateFilter'
})
export class ClientReceiptDateFilterPipe implements PipeTransform {

  /**
   * Keeps the receipts whose date contains `filterBy` (case-insensitive); returns all receipts when the
   * filter is empty.
   */
  transform(value: ClientReceipt[], filterBy: string) : ClientReceipt[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
   return filterBy ? value.filter((clientReceipt : ClientReceipt) => clientReceipt.receiptDate.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
