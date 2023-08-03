import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ])
    ])
  ]

})
export class NavbarComponent implements OnInit {
  changeIcon = false;
  morphNavbar = false;


  @HostListener('window:scroll', ['$event']) onScrollEvent($event: any) {
    // console.log($event);
    // console.log("scrolling", window.pageYOffset);


    if (window.innerWidth > 770) {
      if ((window.pageYOffset / window.innerHeight * 100) > 70) {
        this.morphNavbar = true;
      } else {
        this.morphNavbar = false;
      }
    } else {
      if ((window.pageYOffset / window.innerHeight * 100) > 60) {
        this.morphNavbar = true;
      } else {
        this.morphNavbar = false;
      }
    }

  }

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit(): void {
  }


  toggleIcon(): void {
    this.changeIcon = !this.changeIcon;
  }

}
