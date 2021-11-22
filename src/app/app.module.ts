import { NgModule } from '@angular/core';
import { SortPipe } from './pipes/sort.pipe'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { CatgirlSearchComponent } from './pages/catgirl-search/catgirl-search.component';
import { NFTradeListingComponent } from './pages/nftrade-listing/nftrade-listing.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics/';
import { BrowserModule } from '@angular/platform-browser';
import { NyaScoresComponent } from './pages/nya-scores/nya-scores.component';
import { ChartsModule } from 'ng2-charts';
import { SalesAnalysisComponent } from './pages/sales-analysis/sales-analysis.component';

@NgModule({
  declarations: [
    AppComponent,
    SortPipe,
    HomeComponent,
    CatgirlSearchComponent,
    NFTradeListingComponent,
    NyaScoresComponent,
    SalesAnalysisComponent
  ],
  imports: [
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAXwl4bp4AsvjWOa-xbgqmBnGjbJ_OVRJw",
      authDomain: "catgirlstats.firebaseapp.com",
      projectId: "catgirlstats",
      storageBucket: "catgirlstats.appspot.com",
      messagingSenderId: "1096209442758",
      appId: "1:1096209442758:web:77cbee7be8d6c452f334c7",
      measurementId: "G-QD734G04EE"
    }),
    ChartsModule,
    AngularFireAnalyticsModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
  ],
  providers: [SortPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
