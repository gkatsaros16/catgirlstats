import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Title } from '@angular/platform-browser';
import { Apollo, gql } from 'apollo-angular';
import * as moment from 'moment';
import { timer } from 'rxjs';
import { CatgirlContextService } from 'src/app/services/catgirl-context.service';
import { CryptoContextService } from 'src/app/services/crypto-context.service';
import { nftadeContextService } from 'src/app/services/nftrade-context.service';

@Component({
  selector: 'app-sales-analysis',
  templateUrl: './sales-analysis.component.html',
  styleUrls: ['./sales-analysis.component.scss']
})

export class SalesAnalysisComponent {
  salesData = {};
  catgirls;
  selectedCatgirl;
  earliestSale;
  salesDictionary = {};
  latestSale = new Date();
  disclaimer = false
  sub;
  progress = 50;


  constructor(
    private context: CatgirlContextService,
    private nfTradeContext: nftadeContextService,
    public analytics: AngularFireAnalytics,
    public titleService: Title,
    public crypto: CryptoContextService,
    public http: HttpClient
  ) {}
  
  ngOnInit() {
    this.sub = timer(10000).subscribe(() => {
      this.disclaimer = true;
    });
    this.titleService.setTitle("Catgirl Stats | Sales Analysis")
    this.nfTradeContext.recentSold$.subscribe(x => {
      this.progress = x.length / 10;
      if (x.length == 100) {
        if (!this.context.salesAnalysisSet$.value) {
          x.map(x => {
            this.context.CATGIRLS.map(y => {
              if (y.id == (x.catgirlDetails.rarity + ':' + x.catgirlDetails.characterId)) {
                this.adjustSale(x);
                y.sales.push(x);
              }
            })
            if (!this.earliestSale) {
              this.earliestSale = x.last_Sell_At;
            } else {
              this.earliestSale = this.earliestSale < x.last_Sell_At ? this.earliestSale : x.last_Sell_At;
            }
          })
          this.context.CATGIRLS.forEach(x => {
            x['salesAnalysis'] = this.getQuartiles(x.sales)
          });
        }
        this.catgirls = this.context.CATGIRLS;
        this.context.salesAnalysisSet$.next(true);
      }
    })
  }

  getQuartiles(sales) {
    var sortedPrice = this.sort([...sales]);
    if (sortedPrice.length > 50) {
      sortedPrice.pop();
      sortedPrice.pop();
      sortedPrice.pop();
      sortedPrice.pop();
      sortedPrice.pop();
      sortedPrice.shift();
      sortedPrice.shift();
      sortedPrice.shift();
      sortedPrice.shift();
      sortedPrice.shift();
    }

    var sortedNya = this.sortNya([...sortedPrice]);
    return {
      count: sortedPrice.length,
      mean: this.getMean(sortedPrice),
      q1: this.q25(sortedPrice),
      q2: this.q50(sortedPrice),
      q3: this.q75(sortedPrice),
      avgNya1: this.avgScore(sortedNya, 1),
      avgNya25: this.avgScore(sortedNya, 2, 25),
      avgNya50: this.avgScore(sortedNya, 26, 50),
      avgNya75: this.avgScore(sortedNya, 51, 75),
      avgNya99: this.avgScore(sortedNya, 76, 99),
      avgNya100: this.avgScore(sortedNya, 100),
      avgNya69: this.avgScore(sortedNya, 69)
    }
  }
  
  avgScore = (sortedArr, start, end = null) => {
    var arr = [];
    if (!end) {
      arr = sortedArr.filter(x => parseInt(x.catgirlDetails.nyaScore) == start);
    } else {
      arr = sortedArr.filter(x => parseInt(x.catgirlDetails.nyaScore) >= start && parseInt(x.catgirlDetails.nyaScore) <= end && parseInt(x.catgirlDetails.nyaScore) != 69);
    }
    return { mean: this.getMean(arr), count: arr.length }
  };

  getQuantile = (sortedArr, q) => {
    if (sortedArr.length > 4) {
      const pos = (sortedArr.length - 1) * q;
      const base = Math.floor(pos);
      return sortedArr[base].adjusted_sell;
    }
    return 0;
  };

  q25(arr){
    return this.getQuantile(arr, .25);
  }

  q50(arr){
    return this.getQuantile(arr, .50);
  }

  q75(arr){
    return this.getQuantile(arr, .75);
  }

  getSum(arr){
    var sum = 0;
    arr.forEach(x => {
      sum += parseFloat(x.adjusted_sell);
    });
    return sum;
  }

  getMean(arr){
    return this.getSum(arr) / arr.length;
  }

  sort(arr){
    return arr.sort((a,b) => parseFloat(a.adjusted_sell) > parseFloat(b.adjusted_sell) ? 1 : -1);
  }

  sortNya(arr){
    return arr.sort((a,b) => parseInt(a.catgirlDetails.nyaScore) > parseInt(b.catgirlDetails.nyaScore) ? 1 : -1);
  }

  
  selectCatgirl(catgirl) {
    this.selectedCatgirl = catgirl;
  }

  getSeason(catgirl) {
    return catgirl.season;
  }

  getRarity(catgirl) {
    switch (catgirl.rank) {
      case 0:
        return 'Common';
      case 1:
        return 'Rare';
      case 2:
        return 'Epic';
      case 3:
        return 'Legendary';
      case 4:
        return 'Paw-some';    
      default:
        break;
    }
  }

  getBorderHover(catgirl) {
    switch (catgirl.rank) {
      case 0:
        return 'common-border';
      case 1:
        return 'rare-border';
      case 2:
        return 'epic-border';
      case 3:
        return 'legendary-border';
      case 4:
        return 'pawsome-border';    
      default:
        break;
    }
  }

  getRarityClass(catgirl) {
    switch (catgirl.rank) {
      case 0:
        return 'bg-secondary';
      case 1:
        return 'bg-info text-dark';
      case 2:
        return 'epic';
      case 3:
        return 'legendary text-dark';
      case 4:
        return 'pawsome';    
      default:
        break;
    }
  }

  getType(catgirl) {
    var type = catgirl.id.split(":")
    switch (type[1]) {
      case "0":
        return 'MB';
      case "1":
        return 'AD';   
      default:
        break;
    }
  }

  async adjustSale(sale) {
    var last_sell_date = moment(new Date(sale.last_Sell_At)).format("M/D/YYYY");   
    sale.adjusted_sell = this.caluculateAdjustedSale(this.crypto.bnbPriceBook$.value[last_sell_date], sale.last_Sell); 
  }

  caluculateAdjustedSale(bnbPrice, sell) {
    var usd = parseFloat(sell) * bnbPrice;
    var adjusted = usd / this.crypto.bnbPrice$.value;
    return adjusted;
  }

  getRecentSales(sales) {
    var copy = [...sales];
    copy.sort((a,b) => a.last_Sell_At > b.last_Sell_At ? 1 : -1);
    if (copy.length > 5) {
      return copy.slice(Math.max(copy.length - 5, 0)).reverse();
    }
    return copy.reverse();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
