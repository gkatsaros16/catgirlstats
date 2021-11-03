import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { interval, Subscription, timer } from 'rxjs';
import { nftadeContextService } from '../../../app/services/nftrade-context.service';
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
  selector: 'app-nftrade-listing',
  templateUrl: './nftrade-listing.component.html',
  styleUrls: ['./nftrade-listing.component.scss']
})

export class NFTradeListingComponent {
  recentListing;
  sub: Subscription;
  constructor(
    private apollo: Apollo,
    private context: CatgirlContextService,
    private nfTradeContext: nftadeContextService
    ) {

  }

  ngOnInit() {
    this.sub = timer(1000).subscribe(() => {
      this.recentListing = this.nfTradeContext.recentListings$.value.sort((a,b) => (a.listedAt < b.listedAt) ? 1 : -1);
    });
  }

  sortLowestPriceAsc() {
    this.recentListing = this.nfTradeContext.recentListings$.value.sort((a,b) => (parseFloat(a.price) > parseFloat(b.price)) ? 1 : -1);
  }

  sortHighestNyaDesc() {
    this.recentListing = this.nfTradeContext.recentListings$.value.sort((a,b) => (parseInt(a.catgirlDetails.nyaScore) < parseInt(b.catgirlDetails.nyaScore)) ? 1 : -1);
  }

  sortRecentlyListed() {
    this.recentListing = this.nfTradeContext.recentListings$.value.sort((a,b) => (a.listedAt < b.listedAt) ? 1 : -1);
  }

  goToNFT(trade) {
    window.open(`https://app.nftrade.com/assets/bsc/0xe796f4b5253a4b3edb4bb3f054c03f147122bacd/${trade.tokenID}`, '_blank');
  }

  getCatgirlName(catgirlDetails) {
    var catgirl = this.context.CATGIRLS.find(x => `${catgirlDetails.rarity}:${catgirlDetails.characterId}` == x.id)
    return catgirl.name;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
