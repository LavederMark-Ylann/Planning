import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  isExpanded = false;
  opened = 'none';

  constructor() { }

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

}
