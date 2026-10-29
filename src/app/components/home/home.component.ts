import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageTitles } from 'src/app/constants/page-titles';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private title: Title) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle(PageTitles.HOME);
  }

}
