import { BrowserModule } from '@angular/platform-browser';
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

@NgModule({
  declarations: [
    AppComponent,
    SortPipe,
    HomeComponent,
    CatgirlSearchComponent,
    NFTradeListingComponent
  ],
  imports: [
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
