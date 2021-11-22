import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class CryptoContextService {
    bnbPrice$ = new BehaviorSubject(0);
    bnbPriceBook$ = new BehaviorSubject({count: 0});
    sub$: Subscription;
    constructor(
        private http: HttpClient,
    ) { 
        this.sub$ = timer(500, 10000).subscribe(() => {
            this.getCurrentBNBPrice();
        });
        this.getCryptoPricesForLast16days();
    }

  getCurrentBNBPrice() {
    var today = moment(new Date()).format("M/D/YYYY");
    this.http.get("https://localhost:5002/bnb/GetBNBPriceForDate?date="+today).subscribe((x:any) => {
        if (x) {
            this.bnbPrice$.next(x);
        }
    })
  }

  getCryptoPricesForLast16days() {
    for (let index = 0; index < 17; index++) {
        var date = moment().subtract(index, "days").format("M/D/YYYY");
        this.http.get("https://localhost:5002/bnb/GetBNBPriceForDate?date="+date).subscribe(x => {
            var date = moment().subtract(this.bnbPriceBook$.value.count, "days").format("M/D/YYYY");
            this.bnbPriceBook$.value[date] = x;
            this.bnbPriceBook$.value.count++;
            this.bnbPriceBook$.next(this.bnbPriceBook$.value)
        })
    }
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }
}
