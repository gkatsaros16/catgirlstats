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
    recentSoldHighest$ = new BehaviorSubject([]);
    soldHighest$ = new BehaviorSubject([]);
    soldLowest$ = new BehaviorSubject([]);

    constructor(
        private http: HttpClient,
        private apollo: Apollo
    ) { 
        this.getRecentListings();
        this.getRecentSold();
        this.getSoldHighest();
    }

    // organize through nft trade to get catgirl details then sort into detail view
    // maybe best to create api server that sends requests and updates every 5 minutes instead of page browse.
    getRecentListings() {     
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
                    if (result.data.catgirls[0]) {
                        catgirl.catgirlDetails = result.data.catgirls[0]
                        this.recentListings$.next([...this.recentListings$.value, catgirl])
                    } else {

                    }
                });
            });
        })
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

    getSoldHighest() {
        this.http.get("https://api.nftrade.com/api/v1/tokens?limit=100&skip=0&search=catgirl&order=&verified=&sort=last_sell_desc").subscribe((x:any[]) => {
            // this.recentListings$.next(x)
            // console.log(x);
        })
    }
}
