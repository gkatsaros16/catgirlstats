
import { XhrFactory } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Title } from '@angular/platform-browser';
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
  recentListing$;
  recentListing;

  mittsyCheck;
  celesteCheck;
  rinCheck;
  aoiCheck;
  hanaCheck;
  kitaCheck;
  lisaCheck;
  maeCheck;
  sub: Subscription;
  disableSub: Subscription;
  isDisable;
  filter = [];
  anal
  constructor(
    private apollo: Apollo,
    private context: CatgirlContextService,
    private nfTradeContext: nftadeContextService,
    public analytics: AngularFireAnalytics,
    public titleService: Title,
    ) {
  }

  ngOnInit() {
    this.titleService.setTitle("Catgirl Stats | Search")
    this.sub = timer(500).subscribe(() => {
      this.recentListing$ = this.nfTradeContext.recentListings$.subscribe( x => {
        this.recentListing = x.sort((a,b) => (a.listedAt < b.listedAt) ? 1 : -1);
      });
    });
  }

  disable() {
    this.isDisable = true;
    this.disableSub = timer(1000).subscribe(() => {
      this.isDisable = false;
    })
  }

  sortLowestPriceAsc() {
    this.recentListing = this.nfTradeContext.recentListings$.value.sort((a,b) => (parseFloat(a.price) > parseFloat(b.price)) ? 1 : -1);
  }

  sortHighestNyaDesc() {
    this.recentListing = this.nfTradeContext.recentListings$.value.sort((a,b) => (parseInt(a.catgirlDetails.nyaScore) < parseInt(b.catgirlDetails.nyaScore)) ? 1 : (a.catgirlDetails.nyaScore === b.catgirlDetails.nyaScore) ? ((a.catgirlDetails.rarity < b.catgirlDetails.rarity) ? 1 : -1) : (a.catgirlDetails.rarity === b.catgirlDetails.rarity) ? ((parseFloat(a.catgirlDetails.price) > parseFloat(b.catgirlDetails.price)) ? 1 : -1) : (a.catgirlDetails.price === b.catgirlDetails.price) ? ((a.catgirlDetails.listedAt > b.catgirlDetails.listedAt) ? 1 : -1) : -1);
  }

  sortRecentlyListed() {
    this.recentListing = this.nfTradeContext.recentListings$.value.sort((a,b) => (a.listedAt < b.listedAt) ? 1 :  -1);
  }

  goToNFT(trade) {
    this.analytics.logEvent('go_to_nftrade', {tokenID: trade.tokenID})
    window.open(`https://app.nftrade.com/assets/bsc/0xe796f4b5253a4b3edb4bb3f054c03f147122bacd/${trade.tokenID}`, '_blank');
  }

  getCatgirlName(catgirlDetails) {
    var catgirl = this.context.CATGIRLS.find(x => `${catgirlDetails.rarity}:${catgirlDetails.characterId}` == x.id)
    return catgirl.name;
  }

  applyFilter(catgirlDetails) {
    var index = this.filter.findIndex(x => x.characterId == catgirlDetails.characterId && x.rarity == catgirlDetails.rarity)
    if (index > -1) {
      this.filter.splice(index, 1)
    } else {
      this.filter.push(catgirlDetails);
    }

    if (this.filter.length) {
      this.nfTradeContext.filterRecentListings(this.filter);
    } else {
      this.nfTradeContext.showAllRecentListing();
    }
  }

  refreshListing() {
    this.disable();
    this.clear();
  }

  clear() {
    this.mittsyCheck = false;
    this.celesteCheck= false;
    this.rinCheck= false;
    this.aoiCheck= false;
    this.hanaCheck= false;
    this.kitaCheck= false;
    this.lisaCheck= false;
    this.maeCheck= false;
    this.filter = [];
    this.nfTradeContext.showAllRecentListing();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.recentListing$?.unsubscribe();
    this.disableSub?.unsubscribe();
  }
}
