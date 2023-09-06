import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { style, state, animate, transition, trigger, query, stagger } from '@angular/animations';
import services from "../../../assets/jsons/services.json";

import { INotificationDTO, NotificationDTO } from '../../services/notification-data.model';
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
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
export class ServicesComponent implements OnInit {

  services: any = services.services.filter((service: any) => { return !service.hide });

  user: any = {
    category: 'General'
  };

  emailInvalid = false;
  hasError = false;
  stage = 1;
  refId: any;
  sending = false;

  ccEmailInvalid = false;
  emailExists = false;

  @ViewChild('emailInput') emailInput!: ElementRef;


  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      window.scroll(0, 0);
    }, 10);
  }

  ngAfterViewInit(): void {
    fromEvent(this.emailInput.nativeElement, 'input')
      .pipe(map((event: any) => (event.target as HTMLInputElement).value))
      .pipe(debounceTime(1000))
      .pipe(distinctUntilChanged())
      .subscribe((data) => this.validateEmail());

  }

  validateEmail(): void {
    (/\S+@\S+\.\S+/).test(this.user.email) || !this.user.email
      ///^[A-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Z0-9.-]+$/.test(this.formData.email)
      ? (this.emailInvalid = false)
      : (this.emailInvalid = true);
  }

  sendEmail(): void {
    this.emailInvalid = false;
    this.sending = true;
    this.user.email = this.user.email.toLowerCase();

    this.generateRefId();

    const businessNotificationDTO = this.getBusinessNotificationDTO();
    this.subscribeToSaveResponse(this.notificationService.emailWithoutAttachments(businessNotificationDTO));

  }

  reset(): void {
    this.user = {
      category: 'General'
    };

    this.emailInvalid = false;
    this.hasError = false;
    this.sending = false;
    this.stage = 1;
  }

  generateRefId(): void {
    this.refId = '#NDC-' + new Date().getFullYear() + '' + (new Date().getMonth() + 1) + '' + new Date().getDate() + '' + new Date().getHours() + '' + new Date().getMinutes();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<any>>) {
    result.subscribe(
      (res: any) => this.onSaveSuccess(res),
      (error: any) => this.onSaveError(error));
  }

  protected onSaveSuccess(res: any) {
    // console.log(res);
    this.hasError = false;
    this.stage = 2;
    this.sending = false;
  }

  protected onSaveError(error: any) {
    // console.log(error);
    this.hasError = true;
    this.sending = false;
  }


  private getBusinessNotificationDTO(): any {
    return {
      ...new NotificationDTO(),
      receiverEmail: 'newdaycomm254@gmail.com',
      subject: 'New Day Communications Website Request ' + this.refId,
      body: this.createBusinessMessage(),
      html: true,
      isMultiPart: false

    };
  }


  private createBusinessMessage(): string {
    return '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '    <title> New Day Communications Website Request ' + this.refId + '</title>\n' +
      '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n' +
      '</head>' +
      '<body>\n' +
      '    <p>New mail request from website form,</p>\n' +
      '    <p>Client name: ' + this.user.fullName + '</p>\n' +
      '    <p>Organisation name: ' + this.user.orgName + '</p>\n' +
      '    <p>Client Phone number: ' + this.user.phone + '</p>\n' +
      '    <p>Client Email Address: ' + this.user.email + '</p>\n' +
      '    <p>Request category: ' + this.user.category + '</p>\n' +
      '    <p>Request description: ' + this.user.message + '</p>\n' +
      '</body>' +
      '</html>';
  }

}
