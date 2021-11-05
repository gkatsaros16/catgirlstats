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
    recentSold$ = new BehaviorSubject([]);

    constructor(
        private http: HttpClient,
        private apollo: Apollo
    ) { 
        this.getRecentListings();
        this.getRecentSold();
    }

    getRecentListings() {   
        this.recentListings$.next([]); 
        this.http.get("https://api.nftrade.com/api/v1/tokens?limit=100&skip=0&search=catgirl&order=&verified=&sort=listed_desc").subscribe((x:any[]) => {
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
                        this.recentListings$.next([...this.recentListings$.value, catgirl])
                    } else {

                    }
                });
            });
        })
    }

    filterRecentListings(filterArray) {   
        this.recentListings$.value.forEach(x => {
            if (filterArray.some(y => y.characterId == x.catgirlDetails.characterId && y.rarity == x.catgirlDetails.rarity)) {
                x.show = true;
            } else {
                x.show = false;
            }
        })
        this.recentListings$.next(this.recentListings$.value);
    }

    showAllRecentListing() {   
        this.recentListings$.value.map(x => {
            x.show = true;
        })
        this.recentListings$.next(this.recentListings$.value);
    }

    getRecentSold() {
        var count = 0;
        this.http.get("https://api.nftrade.com/api/v1/tokens?limit=100&skip=0&search=catgirl&order=&verified=&sort=sold_desc").subscribe((x:any[]) => {
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

    getRecentNFTListing(id:any) {
        if (!this.recentListings$.value) {
            this.getRecentListings();
        }
        var recent = this.recentListings$.value;
        if (recent.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id)) {
            return recent.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
        } else {
            return null;
        }
    }

    getRecentNFTSold(id:any) {
        if (!this.recentSold$.value) {
            this.getRecentSold();
        }
        var recentSold = this.recentSold$.value;
        if (recentSold.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id)) {
            var sorted = recentSold.sort((a,b) => (a.last_sell_at < b.last_sell_at) ? 1 : -1);
            return sorted.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
        } else {
            return null
        }
    }

    getRecentHighestNFTSold(id:any) {
        if (!this.recentSold$.value) {
            this.getRecentSold();
        }
        var recentSold = this.recentSold$.value;
        if (recentSold.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id)) {
            var filter = recentSold.filter(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
            var sorted = filter.sort((a,b) => (parseFloat(a.last_sell) < parseFloat(b.last_sell)) ? 1 : -1);
            return sorted.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
        } else {
            return null
        }
    }

    getRecentAveragePrice(id:any) {
        var totalPrice = 0;
        if ((this.recentSold$.value.length == 0)) {
            this.getRecentSold();
        }
        var recentSold = this.recentSold$.value;
        if (recentSold.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id)) {
            var recentAveragePriceArray = recentSold.filter(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
            recentAveragePriceArray.forEach(trans => {
            totalPrice += parseFloat(trans.last_sell);
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
        if ((this.recentSold$.value.length == 0)) {
            this.getRecentSold();
        }
        var recentSold = this.recentSold$.value;
        if (recentSold.find(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id)) {
            var filter = recentSold.filter(x => `${x.catgirlDetails.rarity}:${x.catgirlDetails.characterId}` == id);
            var sorted = filter.sort((a,b) => (parseInt(a.catgirlDetails.nyaScore) < parseInt(b.catgirlDetails.nyaScore)) ? 1 : (a.catgirlDetails.nyaScore === b.catgirlDetails.nyaScore) ? ((parseFloat(a.catgirlDetails.last_sell) > parseFloat(b.catgirlDetails.last_sell)) ? 1 : -1) : -1 );
            var lowest = sorted.filter(x => x.catgirlDetails.nyaScore == sorted[sorted.length - 1].catgirlDetails.nyaScore);
            return [sorted[0], lowest[lowest.length -1]]
        } else {
            return null;
        }
    }
}
