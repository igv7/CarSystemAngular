import { Pipe, PipeTransform } from '@angular/core';
import { ClientReceipt } from '../models/clientReceipt';

@Pipe({
  name: 'clientReceiptFilter'
})

export class ClientReceiptFilterPipe implements PipeTransform {

  transform(value: ClientReceipt[], filterBy: string) : ClientReceipt[] {
   filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
   return filterBy ? value.filter((clientReceipt : ClientReceipt) => clientReceipt.clientName.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
