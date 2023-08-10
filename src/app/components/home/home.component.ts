import { Component, OnInit } from '@angular/core';
import { style, state, animate, transition, trigger, query, stagger } from '@angular/animations';
import content from "../../../assets/jsons/content.json";
import services from "../../../assets/jsons/services.json";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(600, style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInGrow', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, marginTop: 40 }),
          stagger('120ms', [
            animate('500ms ease', style({ opacity: 1, marginTop: 0 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  content: any = content.landing;
  services: any = services.services;
  stats = [
    {
      title: "Audience content-reach",
      figure: "90"
    },
    {
      title: "Business growth rate",
      figure: "95"
    },
    {
      title: "Return of investment",
      figure: "100"
    }
  ]

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      window.scroll(0, 0);
    }, 10);
  }

}
