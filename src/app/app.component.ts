import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { interval, Subscription } from 'rxjs';

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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  CATGIRLS = [
    {
        id: "0:0",
        season: 1,
        rank: 0,
        name: "Mae",
        src: "../assets/catgirls/mae.png",
        total: 0
    },
    {
        id: "1:0",
        season: 1,
        rank: 1,
        name: "Kita",
        src: "../assets/catgirls/kira-web.png",
        total: 0
    },
    {
        id: "2:0",
        season: 1,
        rank: 2,
        name: "Hana",
        src: "../assets/catgirls/hana.png",
        total: 0
    },
    {
        id: "3:0",
        season: 1,
        rank: 3,
        name: "Celeste",
        src: "../assets/catgirls/celeste.png",
        total: 0
    },
    {
        id: "4:0",
        season: 1,
        rank: 4,
        name: "Mittsy",
        src: "../assets/catgirls/mittsy.png",
        total: 0
    },
    {
        id: "0:1",
        season: 1,
        rank: 0,
        name: "Lisa",
        src: "../assets/catgirls/lisa.png",
        total: 0
    },
    {
        id: "1:1",
        season: 1,
        rank: 1,
        name: "Aoi",
        src: "../assets/catgirls/aoi.png",
        total: 0
    },
    {
        id: "2:1",
        season: 1,
        rank: 2,
        name: "Rin",
        src: "../assets/catgirls/rin.png",
        total: 0
    }
  ]
  title = 'catgirl-stats2';
  total = 0;
  selectedCatgirl = {};
  sub: Subscription
  constructor(private apollo: Apollo) {
    
  }

  ngOnInit() {
    this.initCatgirls();
    this.selectedCatgirl = this.CATGIRLS.find(x => x.id == "4:0");
    this.sub = interval(5000).subscribe(() => this.getCatgirls());;
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
  }
}
