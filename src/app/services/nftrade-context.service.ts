import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
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
@Injectable({
  providedIn: 'root'
})
export class nftadeContextService {
    recentListings$ = new BehaviorSubject([]);
    recentTofuListings$ = new BehaviorSubject([]);
    recentSold$ = new BehaviorSubject([]);
    recentTofuSold$ = new BehaviorSubject([]);
    filterNfTradeCount$ = new BehaviorSubject(0);
    filterTofuCount$ = new BehaviorSubject(0);
    
    constructor(
        private http: HttpClient,
        private apollo: Apollo
    ) { 
        this.getRecentTofuListings();
        this.getRecentListings();
        this.getRecentTofuSold();
        this.getRecentSold();
    }

    getRecentListings() {  
        this.recentListings$.next([]); 
        this.filterNfTradeCount$.next(0); 
        this.http.get("https://catgirlstats.dev/NFTrade/GetNFTradeListing").subscribe((x:any[]) => {
            x.forEach(catgirl => {
                this.apollo
                    .watchQuery({
                    query: GET_CATGIRL,
                    variables: {
                        "skip": 0,
                        "orderDirection": "desc",
                        "first": 1,
                        "orderBy": "timestamp",
                        "where": {
                        "id": '0x' + parseInt(catgirl.tokenID).toString(16),
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
                    if (result.data.catgirls[0] && catgirl.contractAddress == "0xe796f4b5253a4b3edb4bb3f054c03f147122bacd") {
                        catgirl.show = true;
                        catgirl.catgirlDetails = result.data.catgirls[0]
                        catgirl.type = 1;
                        this.filterNfTradeCount$.next(this.filterNfTradeCount$.value + 1)
                        this.recentListings$.next([...this.recentListings$.value, catgirl])
                    } else {

                    }
                });
            });
        })
    }

    getRecentTofuListings() {   
        this.recentTofuListings$.next([]); 
        this.filterTofuCount$.next(0); 
        this.http.get("https://catgirlstats.dev/TofuNFT/GetTofuNFTs").subscribe((x:any[]) => {
            x.forEach(catgirl => {
                this.apollo
                    .watchQuery({
                    query: GET_CATGIRL,
                    variables: {
                        "skip": 0,
                        "orderDirection": "desc",
                        "first": 1,
                        "orderBy": "timestamp",
                        "where": {
                        "id": '0x' + parseInt(catgirl.tokenID).toString(16),
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
                    if (result.data.catgirls[0] && catgirl.contractAddress == "0xe796f4b5253a4b3edb4bb3f054c03f147122bacd") {
                        catgirl.show = true;
                        catgirl.catgirlDetails = result.data.catgirls[0]
                        this.filterTofuCount$.next(this.filterTofuCount$.value + 1)
                        this.recentTofuListings$.next([...this.recentTofuListings$.value, catgirl])
                    } else {

                    }
                });
            });
        })
    }

    filterRecentListings(filterArray) {   
        var count = 0;
        this.recentListings$.value.forEach(x => {
            if (filterArray.some(y => y.characterId == x.catgirlDetails.characterId && y.rarity == x.catgirlDetails.rarity)) {
                x.show = true;
                count++
            } else {
                x.show = false;
            }
        })

        this.filterNfTradeCount$.next(count);
        this.recentListings$.next(this.recentListings$.value);

        var count = 0;
        this.recentTofuListings$.value.forEach(x => {
            if (filterArray.some(y => y.characterId == x.catgirlDetails.characterId && y.rarity == x.catgirlDetails.rarity)) {
                x.show = true;
                count++
            } else {
                x.show = false;
            }
        })

        this.filterTofuCount$.next(count);
        this.recentTofuListings$.next(this.recentTofuListings$.value);
    }

    showAllRecentListing() {   
        this.recentListings$.value.map(x => {
            x.show = true;
        });
        this.filterNfTradeCount$.next(this.recentListings$.value.length);
        this.recentListings$.next(this.recentListings$.value);

        this.recentTofuListings$.value.map(x => {
            x.show = true;
        });
        this.filterTofuCount$.next(this.recentTofuListings$.value.length);
        this.recentTofuListings$.next(this.recentTofuListings$.value);
    }

    getRecentSold() {
        this.http.get("https://catgirlstats.dev/NFTrade/GetNFTradeSales500").subscribe((x:any[]) => {
            x.forEach(catgirl => {
                this.apollo
                    .watchQuery({
                    query: GET_CATGIRL,
                    variables: {
                        "skip": 0,
                        "orderDirection": "desc",
                        "first": 1,
                        "orderBy": "timestamp",
                        "where": {
                        "id": '0x' + parseInt(catgirl.tokenID).toString(16),
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
                        catgirl.catgirlDetails = result.data.catgirls[0]
                        this.recentSold$.next([...this.recentSold$.value, catgirl])
                    } else {

                    }
                });
            });
        })
    }

    getRecentTofuSold() {
        this.http.get("https://localhost:4200/TofuNFT/GetTofuNFTSales").subscribe((x:any[]) => {
            x.forEach(catgirl => {
                this.apollo
                    .watchQuery({
                    query: GET_CATGIRL,
                    variables: {
                        "skip": 0,
                        "orderDirection": "desc",
                        "first": 1,
                        "orderBy": "timestamp",
                        "where": {
                        "id": '0x' + parseInt(catgirl.tokenID).toString(16),
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
                        catgirl.catgirlDetails = result.data.catgirls[0]
                        this.recentTofuSold$.next([...this.recentTofuSold$.value, catgirl])
                    } else {

                    }
                });
            });
        })
    }

    getRecentNFTListing(id:any) {
        var recent = this.recentListings$.value;
        if (recent.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id)) {
            return recent.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
        } else {
            return null;
        }
    }

    getRecentNFTSold(id:any) {
        var recentSold = this.recentSold$.value;
        if (recentSold.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id)) {
            var sorted = recentSold.sort((a,b) => (a.last_Sell_At < b.last_Sell_At) ? 1 : -1);
            return sorted.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
        } else {
            return null
        }
    }

    getRecentHighestNFTSold(id:any) {
        var recentSold = this.recentSold$.value;
        if (recentSold.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id)) {
            var filter = recentSold.filter(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
            var sorted = filter.sort((a,b) => (parseFloat(a.last_Sell) < parseFloat(b.last_Sell)) ? 1 : -1);
            return sorted.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
        } else {
            return null
        }
    }

    getRecentAveragePrice(id:any) {
        var totalPrice = 0;
        var recentSold = this.recentSold$.value;
        if (recentSold.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id)) {
            var recentAveragePriceArray = recentSold.filter(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
            recentAveragePriceArray.forEach(trans => {
            totalPrice += parseFloat(trans.last_Sell);
            });

            return {
                total: totalPrice,
                count: recentAveragePriceArray.length
            };
        } else {
            return null;
        }
    }

    getNyaScore (id:any) {
        var recentSold = this.recentSold$.value;
        if (recentSold.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id)) {
            var filter = recentSold.filter(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
            var sorted = filter.sort((a,b) => (parseInt(a.catgirlDetails.nyaScore) < parseInt(b.catgirlDetails.nyaScore)) ? 1 : (a.catgirlDetails.nyaScore === b.catgirlDetails.nyaScore) ? ((parseFloat(a.catgirlDetails.last_Sell) > parseFloat(b.catgirlDetails.last_Sell)) ? 1 : -1) : -1 );
            var lowest = sorted.filter(x => x.catgirlDetails.nyaScore == sorted[sorted.length - 1].catgirlDetails.nyaScore);
            return [sorted[0], lowest[lowest.length -1]]
        } else {
            return null;
        }
    }
}
