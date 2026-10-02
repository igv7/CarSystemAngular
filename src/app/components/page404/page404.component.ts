import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css']
})
export class Page404Component implements OnInit {

  constructor(private title: Title) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle("Page Not Found");
  }

}
