import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SortPipe } from './pipes/sort.pipe'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SortPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule
  ],
  providers: [SortPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
