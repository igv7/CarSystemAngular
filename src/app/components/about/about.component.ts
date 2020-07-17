import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  public constructor(private title: Title, private router: Router) { }

  public ngOnInit(): void {
    this.title.setTitle("About Us");
  }

  public homePage() {
    this.router.navigate(["/home"])
  }


}
