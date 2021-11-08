import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatgirlContextService {
  constructor(

  ) { }

  CATGIRLS = [
    {
        id: "0:0",
        season: 1,
        rank: 0,
        name: "Mae",
        src: "../assets/catgirls/mae.png",
        total: 0,
        nyaScore: null
    },
    {
        id: "1:0",
        season: 1,
        rank: 1,
        name: "Kita",
        src: "../assets/catgirls/kira-web.png",
        total: 0,
        nyaScore: null
    },
    {
        id: "2:0",
        season: 1,
        rank: 2,
        name: "Hana",
        src: "../assets/catgirls/hana.png",
        total: 0,
        nyaScore: null
    },
    {
        id: "3:0",
        season: 1,
        rank: 3,
        name: "Celeste",
        src: "../assets/catgirls/celeste.png",
        total: 0,
        nyaScore: null
    },
    {
        id: "4:0",
        season: 1,
        rank: 4,
        name: "Mittsy",
        src: "../assets/catgirls/mittsy.png",
        total: 0,
        nyaScore: null
    },
    {
        id: "0:1",
        season: 1,
        rank: 0,
        name: "Lisa",
        src: "../assets/catgirls/lisa.png",
        total: 0,
        nyaScore: null
    },
    {
        id: "1:1",
        season: 1,
        rank: 1,
        name: "Aoi",
        src: "../assets/catgirls/aoi.png",
        total: 0,
        nyaScore: null
    },
    {
        id: "2:1",
        season: 1,
        rank: 2,
        name: "Rin",
        src: "../assets/catgirls/rin.png",
        total: 0,
        nyaScore: null
    }
  ]
}
