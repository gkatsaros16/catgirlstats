import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class AdsContextService {
    mobileAd;
    bigAd;
    constructor(

    ) { 
        
    }

  ngOnDestroy() {

  }
}
