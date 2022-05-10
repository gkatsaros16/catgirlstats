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
        this.sub$ = timer(500, 60000).subscribe(() => {
            this.getCurrentBNBPrice();
        });
        this.getCryptoPricesForLast16days();
    }

  getCurrentBNBPrice() {
    this.http.get("https://catgirlstats.dev/bnb/GetBNBPriceForToday").subscribe((x:any) => {
        if (x) {
            this.bnbPrice$.next(x);
        }
    })
  }

  getCryptoPricesForLast16days() {
    //needs refactor to one db call lol...
    for (let index = 0; index < 120; index++) {
        var date = moment().subtract(index, "days").format("M/D/YYYY");
        this.http.get("https://catgirlstats.dev/bnb/GetBNBPriceForDate?date="+date).subscribe(x => {
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
