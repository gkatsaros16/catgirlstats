import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatgirlSearchComponent } from './pages/catgirl-search/catgirl-search.component';
import { NFTradeListingComponent } from './pages/nftrade-listing/nftrade-listing.component';
import { NyaScoresComponent } from './pages/nya-scores/nya-scores.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'search',
    component: CatgirlSearchComponent,
  },
  {
    path: 'nft-listing',
    component: NFTradeListingComponent,
  },
  {
    path: 'nya-scores',
    component: NyaScoresComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
