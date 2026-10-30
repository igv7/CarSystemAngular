import { Component, Input } from '@angular/core';

/** Box with a one-line message shown in place of a page's table, e.g. a wrong id or an empty list. Hidden while `text` is empty. */
@Component({
  selector: 'app-page-message',
  templateUrl: './page-message.component.html',
  styleUrls: ['./page-message.component.css']
})
export class PageMessageComponent {

  @Input() text: string;

  /** Dark text on a light box, for the white modal forms; the default is white text for the car background. */
  @Input() light = false;
}
