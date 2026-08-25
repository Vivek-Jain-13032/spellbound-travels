import { Injectable } from '@angular/core';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class GtmService {

  pushEvent(eventName: string, data: any = {}) {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: eventName,
      ...data
    });

    console.log('GTM Event:', eventName, data);
  }
}