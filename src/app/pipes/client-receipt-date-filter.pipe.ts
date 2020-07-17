import { Pipe, PipeTransform } from '@angular/core';
import { ClientReceipt } from '../models/clientReceipt';

@Pipe({
  name: 'clientReceiptDateFilter'
})
export class ClientReceiptDateFilterPipe implements PipeTransform {

  transform(value: ClientReceipt[], filterBy: string) : ClientReceipt[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
   return filterBy ? value.filter((clientReceipt : ClientReceipt) => clientReceipt.receiptDate.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
