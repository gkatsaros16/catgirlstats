import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CatgirlContextService } from 'src/app/services/catgirl-context.service';
import { nftadeContextService } from 'src/app/services/nftrade-context.service';

let GET_CATGIRL = gql`
        query GetCatgirls($first: Int, $skip: Int = 0, $orderBy: String, $orderDirection: String = asc, $where: Catgirl_filter) {
          catgirls(
            first: $first
            skip: $skip
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
          ) {
            id
            characterId
            season
            rarity
            nyaScore
            __typename
          }
        }
`;

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
  selector: 'app-catgirl-search',
  templateUrl: './catgirl-search.component.html',
  styleUrls: ['./catgirl-search.component.scss']
})

export class CatgirlSearchComponent {
  catgirlNumber;
  catgirl;
  CATGIRLS;
  total = 0;
  error;
  analytics
  recentNFTListing;
  recentNFTSold;
  highestNFTSold;
  recentSold;
  constructor(
    private apollo: Apollo,
    private context: CatgirlContextService,
    private nfTradeContext: nftadeContextService
  ) {
    this.CATGIRLS = this.context.CATGIRLS;
  }

  ngOnInit() {
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

  check() {
    this.getRecentNFTListing()
  }

  getRecentNFTListing() {
    var recent = this.nfTradeContext.recentListings$.value;
    this.recentNFTListing = recent.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == this.catgirl.id);
  }

  getRecentNFTSold() {
    this.recentSold = this.nfTradeContext.recentSold$.value;
    var sorted = this.recentSold.sort((a,b) => (a.last_sell_at < b.last_sell_at) ? 1 : -1);
    this.recentNFTSold = sorted.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == this.catgirl.id);
  }

  getHighestNFTSold() {
    var highestSold = this.nfTradeContext.soldHighest$.value;
    this.highestNFTSold = highestSold.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == this.catgirl.id);
  }

  getCatgirl() {
      this.apollo
        .watchQuery({
          query: GET_CATGIRL,
          variables: {
            "skip": 0,
            "orderDirection": "desc",
            "first": 1,
            "orderBy": "timestamp",
            "where": {
              "id": '0x' + this.catgirlNumber.toString(16),
              "rarity_in": [
                0,
                1,
                2,
                3,
                4
              ]
            }
          }
        })
        .valueChanges.subscribe((result: any) => {
          if (result.data.catgirls[0]) {
            this.catgirl = this.CATGIRLS.find(x => x.id == `${result.data.catgirls[0].rarity}:${result.data.catgirls[0].characterId}`);
            this.catgirl.nyaScore = result.data.catgirls[0].nyaScore;
            this.getRecentNFTListing();
            this.getRecentNFTSold();
            // this.getHighestNFTSold();
            this.error = "";
          } else {
            this.catgirl = null;
            this.error = "No catgirls found with that number nya~"
          }
      });
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