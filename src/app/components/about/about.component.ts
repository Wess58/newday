import { Component, OnInit } from '@angular/core';
import { style, state, animate, transition, trigger, query, stagger } from '@angular/animations';
import content from "../../../assets/jsons/content.json";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
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
export class AboutComponent implements OnInit {

  principles: any = content.principles;


  constructor() { }

  ngOnInit(): void {

    setTimeout(() => {
      window.scroll(0, 0);
    }, 10);
  }

}
