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
 
}
