import { Component, OnInit } from '@angular/core';
import { SessionWatchService } from 'src/app/services/session-watch.service';

/** Root component the app starts from: the header plus the routed page. Starts the session watch. */
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private sessionWatchService: SessionWatchService) { }

  ngOnInit(): void {
    this.sessionWatchService.start();
  }

}
