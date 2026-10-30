import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageTitles } from 'src/app/constants/page-titles';
import { AppRoutes } from 'src/app/constants/app-routes';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css']
})
export class Page404Component implements OnInit {

  /** Route links used by the template. */
  public readonly routes = AppRoutes;

  constructor(private title: Title) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle(PageTitles.PAGE_NOT_FOUND);
  }

}
