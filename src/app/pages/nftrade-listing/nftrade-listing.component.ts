
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
  recentTofuListing$;
  recentTofuListing = [];

  mittsyCheck;
  celesteCheck;
  rinCheck;
  aoiCheck;
  hanaCheck;
  kitaCheck;
  lisaCheck;
  maeCheck;
  nfTradeCheck = false;
  tofuNFTCheck = true;
  sub: Subscription;
  disableSub: Subscription;
  isDisable;
  filter = [];
  filterNfTradeCount$;
  filterNfTradeCount;
  filterTofuCount$;
  filterTofuCount;
  listing = 2;
  showAuction = true;
  
  constructor(
    private apollo: Apollo,
    private context: CatgirlContextService,
    private nfTradeContext: nftadeContextService,
    public analytics: AngularFireAnalytics,
    public titleService: Title,
    ) {
  }

  ngOnInit() {
    this.titleService.setTitle("Catgirl Stats | NFT Listing")
    this.sub = timer(500).subscribe(() => {
      this.recentTofuListing$ = this.nfTradeContext.recentTofuListings$.subscribe( x => {
        this.recentTofuListing = x;
      });
      this.recentListing$ = this.nfTradeContext.recentListings$.subscribe( x => {
        this.recentListing = x.sort((a,b) => (a.listedAt < b.listedAt) ? 1 : -1);
      });
    });

    this.filterNfTradeCount$ = this.nfTradeContext.filterNfTradeCount$.subscribe(x => {
      this.filterNfTradeCount = x
    });
    this.filterTofuCount$ = this.nfTradeContext.filterTofuCount$.subscribe(x => {
      this.filterTofuCount = x
    });
  }

  disable() {
    this.isDisable = true;
    this.disableSub = timer(1000).subscribe(() => {
      this.isDisable = false;
    })
  }

  sortLowestPriceAsc() {
    this.recentListing = 
    this.nfTradeContext.recentListings$.value.sort((a,b) => 
    (parseFloat(a.price) > parseFloat(b.price)) ? 
    1 : (parseFloat(a.price) === parseFloat(b.price)) ? 
    ((a.catgirlDetails.rarity < b.catgirlDetails.rarity) ? 
    1 : (a.catgirlDetails.rarity === b.catgirlDetails.rarity) ? 
    ((parseInt(a.catgirlDetails.nyaScore) < parseInt(b.catgirlDetails.nyaScore)) ? 
    1 : -1) : -1) : -1);

    this.recentTofuListing = 
    this.nfTradeContext.recentTofuListings$.value.sort((a,b) => 
    (parseFloat(a.price) > parseFloat(b.price)) ? 
    1 : (parseFloat(a.price) === parseFloat(b.price)) ? 
    ((a.catgirlDetails.rarity < b.catgirlDetails.rarity) ? 
    1 : (a.catgirlDetails.rarity === b.catgirlDetails.rarity) ? 
    ((parseInt(a.catgirlDetails.nyaScore) < parseInt(b.catgirlDetails.nyaScore)) ? 
    1 : -1) : -1) : -1);
  }

  sortHighestNyaDesc() {
    this.recentListing = 
    this.nfTradeContext.recentListings$.value.sort((a,b) => 
    (parseInt(a.catgirlDetails.nyaScore) < parseInt(b.catgirlDetails.nyaScore)) ? 
    1 : (a.catgirlDetails.nyaScore === b.catgirlDetails.nyaScore) ? 
    ((a.catgirlDetails.rarity < b.catgirlDetails.rarity) ? 
    1 : (a.catgirlDetails.rarity === b.catgirlDetails.rarity) ? 
    ((parseFloat(a.price) > parseFloat(b.price)) ? 
    1 : -1) : -1) : -1);

    this.recentTofuListing = 
    this.nfTradeContext.recentTofuListings$.value.sort((a,b) => 
    (parseInt(a.catgirlDetails.nyaScore) < parseInt(b.catgirlDetails.nyaScore)) ? 
    1 : (a.catgirlDetails.nyaScore === b.catgirlDetails.nyaScore) ? 
    ((a.catgirlDetails.rarity < b.catgirlDetails.rarity) ? 
    1 : (a.catgirlDetails.rarity === b.catgirlDetails.rarity) ? 
    ((parseFloat(a.price) > parseFloat(b.price)) ? 
    1 : -1) : -1) : -1);
  }

  sortRecentlyListed() {
    this.recentListing = this.nfTradeContext.recentListings$.value.sort((a,b) => (a.listedAt < b.listedAt) ? 1 :  -1);
    this.recentTofuListing = this.nfTradeContext.recentTofuListings$.value.sort((a,b) => (a.listedAt < b.listedAt) ? 1 :  -1);
  }

  goToNFT(trade) {
    if (trade.type == 2) {
      this.analytics.logEvent('go_to_tofunft', {tokenID: trade.tokenID});
      window.open(`https://tofunft.com/nft/bsc/0xE796f4b5253a4b3Edb4Bb3f054c03F147122BACD/${trade.tokenID}`, '_blank');
    } else {
      this.analytics.logEvent('go_to_tofunft', {tokenID: trade.tokenID});
      window.open(`https://app.nftrade.com/assets/bsc/0xe796f4b5253a4b3edb4bb3f054c03f147122bacd/${trade.tokenID}`, '_blank');
    }
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

  toggleAuction() {
    this.showAuction = !this.showAuction
    this.nfTradeContext.recentTofuListings$.value.forEach(x => {
      if (x.sellType == 'auction') {
        x.show = this.showAuction;
      }
    })
  }

  refreshListing() {
    this.disable();
    this.clear();
    this.nfTradeContext.getRecentTofuListings();
    this.nfTradeContext.getRecentListings();
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
    this.nfTradeCheck = true;
    this.tofuNFTCheck = false;
    this.listing = 2;
    this.filter = [];
    this.nfTradeContext.showAllRecentListing();
  }

  getType(trade) {
    if (trade.type == 2) {
      return "TofuNFT"
    } else {
      return "Nftrade"
    }
  }

  changeListing(value) {
    if (value == 1) {
      this.nfTradeCheck = true;
      this.tofuNFTCheck = false;
    }
    if (value == 2) {
      this.tofuNFTCheck = true;
      this.nfTradeCheck = false;
    }
    this.listing = value;
  }

  goToKemo() {
    this.analytics.logEvent('goToMimi')
    window.open('https://kemonomimi.me/', "_blank");
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.recentListing$?.unsubscribe();
    this.disableSub?.unsubscribe();
  }
}
