import { Component, ViewChild } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Title } from '@angular/platform-browser';
import { Apollo, gql } from 'apollo-angular';
import { CatgirlContextService } from 'src/app/services/catgirl-context.service';
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
  latestSale = Date.now();
  constructor(
    private context: CatgirlContextService,
    private nfTradeContext: nftadeContextService,
    public analytics: AngularFireAnalytics,
    public titleService: Title
  ) {}
  
  ngOnInit() {
    this.titleService.setTitle("Catgirl Stats | Sales Analysis")
    this.nfTradeContext.recentSold$.subscribe(x => {
      if (x.length == 1000) {
        console.log(x)
        if (!this.context.salesAnalysisSet$.value) {
          x.map(x => {
            this.context.CATGIRLS.map(y => {
              if (y.id == (x.catgirlDetails.rarity + ':' + x.catgirlDetails.characterId)) {
                y.sales.push(x)
              }
            })
            if (!this.earliestSale) {
              this.earliestSale = x.last_sell_at;
            } else {
              this.earliestSale = this.earliestSale < x.last_sell_at ? this.earliestSale : x.last_sell_at;
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
      const pos = (sortedArr.length - 1) * q;
      const base = Math.floor(pos);
      return sortedArr[base].last_sell;
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
      sum += parseFloat(x.last_sell);
    });
    return sum;
  }

  getMean(arr){
    return this.getSum(arr) / arr.length;
  }

  sort(arr){
    return arr.sort((a,b) => parseFloat(a.last_sell) > parseFloat(b.last_sell) ? 1 : -1);
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
}
