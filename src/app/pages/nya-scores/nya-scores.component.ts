
import { XhrFactory } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Title } from '@angular/platform-browser';
import { Apollo, gql } from 'apollo-angular';
import { interval, Subscription, timer } from 'rxjs';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { nftadeContextService } from '../../services/nftrade-context.service';
import { CatgirlContextService } from '../../services/catgirl-context.service'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-nya-scores-listing',
  templateUrl: './nya-scores.component.html',
  styleUrls: ['./nya-scores.component.scss']
})

export class NyaScoresComponent {
  catgirls;
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales:{ 
      xAxes: [{}], 
      yAxes: [{            
        ticks: {
          suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
          // OR //
          beginAtZero: true   // minimum value will be 0.
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  constructor(
    private context: CatgirlContextService,
    private nfTradeContext: nftadeContextService,
    public analytics: AngularFireAnalytics,
    public titleService: Title,
    ) {

  }

  ngOnInit() {
    this.titleService.setTitle("Catgirl Stats | Nya Scores")
    this.context.getCatgirlsNyaScores();
    timer(2000).subscribe(() => {
      this.catgirls = this.context.CATGIRLS;
    })
  }

   // events
   public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }

  getOptions(values) {
    return {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales:{ 
        xAxes: [{}], 
        yAxes: [{            
          ticks: {
            suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
            // OR //
            beginAtZero: true   // minimum value will be 0.
          }
        }]
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
  }

  // getDataSet(data) {
  //   var res = []
  //   var sort = data.nyaScores.sort((a,b) => parseInt(a.catgirlNyaScore) < parseInt(b.catgirlNyaScore) ? 1 : -1);
  //   sort.forEach(x => {
  //     res.push(x.count)
  //   });
  //   console.log("Data", res, data.id);
  //   return [{data: res}];
  // }

  // getLabels(data) {
  //   var res = []
  //   var sort = data.nyaScores.sort((a,b) => parseInt(a.catgirlNyaScore) < parseInt(b.catgirlNyaScore) ? 1 : -1);
  //   sort.forEach(x => {
  //     res.push(x.catgirlNyaScore.toString())
  //   });
  //   console.log("Labels", res, data.id);
  //   return res;
  // }

  ngOnDestroy() {

  }
}
