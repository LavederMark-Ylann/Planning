import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private router: Router) {}

  isExpanded = false;
  opened = 'none';

  ngOnInit(): void {
  }

  checkOpened(name: string) {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.opened = name;
    }
    else {
      if (name === this.opened) {
        this.isExpanded = false;
        this.opened = 'none';
      }
      else {
        this.opened = name;
      }
    }
  }

  getUrl() {
    return this.router.url.split('?')[0];
  }

}
