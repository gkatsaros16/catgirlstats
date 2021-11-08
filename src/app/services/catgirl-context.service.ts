import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
let GET_CATGIRLS = gql`
        query GetCatgirls($first: Int, $skip: Int = 0) {
          catgirls(
            first: $first
            skip: $skip
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

@Injectable({
  providedIn: 'root'
})
export class CatgirlContextService {
    allCatgirls$ = new BehaviorSubject([]);
    nyaScores$ = new BehaviorSubject([]);
    totalCatgirls$ = new BehaviorSubject(0);
  constructor(
    private apollo: Apollo,
    private http: HttpClient,
  ) { 
    this.getTotalCatgirls();
  }

  CATGIRLS = [
    {
        id: "0:0",
        season: 1,
        rank: 0,
        name: "Mae",
        src: "../assets/catgirls/mae.png",
        total: 0,
        nyaScore: null,
        nyaScores: {
            values: [],
            count: [],
            options: {}
        }
    },
    {
        id: "1:0",
        season: 1,
        rank: 1,
        name: "Kita",
        src: "../assets/catgirls/kira-web.png",
        total: 0,
        nyaScore: null,
        nyaScores: {
            values: [],
            count: [],
            options: {}
        }
    },
    {
        id: "2:0",
        season: 1,
        rank: 2,
        name: "Hana",
        src: "../assets/catgirls/hana.png",
        total: 0,
        nyaScore: null,
        nyaScores: {
            values: [],
            count: [],
            options: {}
        }
    },
    {
        id: "3:0",
        season: 1,
        rank: 3,
        name: "Celeste",
        src: "../assets/catgirls/celeste.png",
        total: 0,
        nyaScore: null,
        nyaScores: {
            values: [],
            count: [],
            options: {}
        }
    },
    {
        id: "4:0",
        season: 1,
        rank: 4,
        name: "Mittsy",
        src: "../assets/catgirls/mittsy.png",
        total: 0,
        nyaScore: null,
        nyaScores: {
            values: [],
            count: [],
            options: {}
        }
    },
    {
        id: "0:1",
        season: 1,
        rank: 0,
        name: "Lisa",
        src: "../assets/catgirls/lisa.png",
        total: 0,
        nyaScore: null,
        nyaScores: {
            values: [],
            count: [],
            options: {}
        }
    },
    {
        id: "1:1",
        season: 1,
        rank: 1,
        name: "Aoi",
        src: "../assets/catgirls/aoi.png",
        total: 0,
        nyaScore: null,
        nyaScores: {
            values: [],
            count: [],
            options: {}
        }
    },
    {
        id: "2:1",
        season: 1,
        rank: 2,
        name: "Rin",
        src: "../assets/catgirls/rin.png",
        total: 0,
        nyaScore: null,
        nyaScores: {
            values: [],
            count: [],
            options: {}
        }
    }
  ]

  getAllCatgirls(skip = 0) {
    this.apollo
    .watchQuery({
        query: GET_CATGIRLS,
        variables: {
            "first": 1000,
            "skip": skip,
        }
    }).valueChanges.subscribe((result: any) => {
        if (result.data?.catgirls) {
            skip += 1000;
            this.allCatgirls$.next([...this.allCatgirls$.value, ...result.data.catgirls])
            console.log(skip)
            if (skip <= this.totalCatgirls$.value) {
                this.getAllCatgirls(skip);
            }
        } else {

        }
    });
  }

  getTotalCatgirls() {
    this.CATGIRLS.forEach(catgirl => {
        this.apollo
          .watchQuery({
            query: GET_COUNT,
            variables: {
              id: catgirl.id
            }
          })
          .valueChanges.subscribe((result: any) => {
            catgirl.total = result?.data?.characterCount?.total;
            this.totalCatgirls$.next(this.totalCatgirls$.value + result?.data?.characterCount?.total) 
        });
      });
  }

  getCatgirlsNyaScores() {
    this.CATGIRLS.forEach(catgirl => {
        var split = catgirl.id.split(':');
        var model = {
            catgirlcharacterId: split[1],
            catgirlrarity: split[0]
        }
        this.http.post("https://localhost:5002/CatgirlStats/GetAllCatgirlsNyaScoreCount", model).subscribe((x:any) => {
            var values = [];
            var count =[];

            x.sort((a,b) => parseInt(a.catgirlNyaScore) < parseInt(b.catgirlNyaScore) ? 1 : -1).map(x => {
                values.push(x.catgirlNyaScore);
                count.push(x.count);
            });
            var min = Math.min(...count) - 10;
            catgirl.nyaScores = {
                values: [{data: count, label: catgirl.name}], 
                count: values,
                options: {
                    responsive: true,
                    // We use these empty structures as placeholders for dynamic theming.
                    scales:{ 
                      xAxes: [{}], 
                      yAxes: [{            
                        ticks: {
                          suggestedMin: min < 0 ? 0 : min
                        }
                      }]
                    },
                    plugins: {
                      datalabels: {
                        anchor: 'end',
                        align: 'end',
                      }
                    }
                }
            };     
        })
    });
  }

  ngOnDestroy() {

  }
}
