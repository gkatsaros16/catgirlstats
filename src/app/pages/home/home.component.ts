import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Apollo, gql } from 'apollo-angular';
import { interval, Subscription, timer } from 'rxjs';
import { nftadeContextService } from 'src/app/services/nftrade-context.service';
import { CatgirlContextService } from '../../services/catgirl-context.service'

let GET_COUNT = gql`
      query GetCount($id: String) {
        characterCount(id: $id) {
          id
          total
          __typename
        }
      }
`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  total = 0;
  selectedCatgirl = {};
  sub: Subscription
  sub2: Subscription
  CATGIRLS
  loading = true;
  constructor(
    private apollo: Apollo,
    private context: CatgirlContextService,
    private nfTradeContext: nftadeContextService,
    private titleService: Title
    ) {
    this.CATGIRLS = this.context.CATGIRLS;
  }

  ngOnInit() {
    this.titleService.setTitle("Catgirl Stats")
    this.initCatgirls();
    this.selectedCatgirl = this.CATGIRLS.find(x => x.id == "4:0");
    this.sub = interval(5000).subscribe(() => this.getCatgirls());
    this.sub2 = timer(1000).subscribe(() => {
      this.getNFTTadeStats()
      this.loading = false;
    });
  }

  getNFTTadeStats() {
    this.CATGIRLS.forEach(catgirl => {
      catgirl.recentListing = this.nfTradeContext.getRecentNFTListing(catgirl.id);  
      catgirl.recentSold = this.nfTradeContext.getRecentNFTSold(catgirl.id);  
      catgirl.averagePrice = this.nfTradeContext.getRecentAveragePrice(catgirl.id);
    })
  }

  getCatgirls() {
    this.CATGIRLS.forEach(CATGIRL => {
      this.apollo
        .watchQuery({
          query: GET_COUNT,
          variables: {
            id: CATGIRL.id
          }
        })
        .valueChanges.subscribe((result: any) => {
          if (CATGIRL.total != result?.data?.characterCount?.total) {
            var prev = CATGIRL.total;
            CATGIRL.total = result?.data?.characterCount?.total;
            this.total += CATGIRL.total - prev;
          }
      });
    });
  }

  initCatgirls() {
    this.CATGIRLS.forEach(CATGIRL => {
      this.apollo
        .watchQuery({
          query: GET_COUNT,
          variables: {
            id: CATGIRL.id
          }
        })
        .valueChanges.subscribe((result: any) => {
            CATGIRL.total = result?.data?.characterCount?.total;
            this.total += result?.data?.characterCount?.total;
      });
    });
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

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }
}
