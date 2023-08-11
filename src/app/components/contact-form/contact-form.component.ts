import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import services from "../../../assets/jsons/services.json";
import { INotificationDTO, NotificationDTO } from '../../services/notification-data.model';
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  user: any = {
    category: 'General'
  };
  services: any = services.services;
  emailInvalid = false;
  refId = '';
  hasError = false;
  sending = false;

  @ViewChild('emailInput') emailInput!: ElementRef;

  constructor(
    private notificationService: NotificationService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
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
      ? ((this.emailInvalid = false))
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
    // this.router.navigate(['/']);
    window.history.back();


    this.user = {
      category: 'General'
    };

    this.emailInvalid = false;
    this.hasError = false;
    this.sending = false;
  }

  generateRefId(): void {
    this.refId = '#NDC-' + '' + new Date().getFullYear() + '' + (new Date().getMonth() + 1) + '' + new Date().getDate() + '' + new Date().getHours() + '' + new Date().getMinutes();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<any>>) {
    result.subscribe(
      (res: any) => this.onSaveSuccess(res),
      (error: any) => this.onSaveError(error));
  }

  protected onSaveSuccess(res: any) {
    // console.log(res);

    this.hasError = false;
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
      receiverEmail: 'tecomadvance@gmail.com',
      subject: 'New Day Communications Website Mail Request ' + this.refId,
      body: this.createBusinessMessage(),
      html: true,
      isMultiPart: false

    };
  }


  private createBusinessMessage(): string {
    return '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '    <title> New Day Communications Website Mail Request ' + this.refId + '</title>\n' +
      '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n' +
      '</head>' +
      '<body>\n' +
      '    <p>New mail request from website form,</p>\n' +
      '    <p>Client name: ' + this.user.name + '</p>\n' +
      '    <p>Organisation name: ' + this.user.orgName + '</p>\n' +
      '    <p>Client Phone number: ' + this.user.phone + '</p>\n' +
      '    <p>Client Email Address: ' + this.user.email + '</p>\n' +
      '    <p>Request category: ' + this.user.category + '</p>\n' +
      '    <p>Request description: ' + this.user.message + '</p>\n' +
      '</body>' +
      '</html>';
  }


}
