import { Component } from '@angular/core';
import { BucketService }        from './bucket.service';
import { JSONP_PROVIDERS }  from '@angular/http';
export class Bucket {
  CreationDate: string;
  Name: string;
}

const MelonBuckets: Bucket[] = [
  { CreationDate: '11', Name: 'Mr. Nice' },
  { CreationDate: '12', Name: 'Narco' },
  { CreationDate: '13', Name: 'Bombasto' },
  { CreationDate: '20', Name: 'Tornado' }
];


@Component({
  selector: 'my-app',
 template: `
    <h1>{{title}}</h1>
    <h2>My buckets</h2>
    <ul class="buckets">
      <li *ngFor="let buck of allbuckts"
        [class.selected]="buck === selectedHero"
        (click)="onSelect(buck)">
        <span class="badge">{{buck.Name}}</span> {{buck.CreationDate}}
      </li>
    </ul>
    <div *ngIf="selectedHero">
      <h2>{{selectedHero.Name}} details!</h2>
      <div><label>CreationDate: </label>{{selectedHero.CreationDate}}</div>
      <div>
        <label>Name: </label>
        <input [(ngModel)]="selectedHero.Name" placeholder="Name"/>
      </div>
    </div>
  `,
  styles: [`
    .selected {
      background-color: #CFD8DC !important;
      color: white;
    }
    .buckets {
      margin: 0 0 2em 0;
      list-style-type: none;
      padding: 0;
      width: 15em;
    }
    .buckets li {
      cursor: pointer;
      position: relative;
      left: 0;
      background-color: #EEE;
      margin: .5em;
      padding: .3em 0;
      height: 1.6em;
      border-radius: 4px;
    }
    .buckets li.selected:hover {
      background-color: #BBD8DC !important;
      color: white;
    }
    .buckets li:hover {
      color: #607D8B;
      background-color: #DDD;
      left: .1em;
    }
    .buckets .text {
      position: relative;
      top: -3px;
    }
    .heroes .badge {
      display: inline-block;
      font-size: small;
      color: white;
      padding: 0.8em 0.7em 0 0.7em;
      background-color: #607D8B;
      line-height: 1em;
      position: relative;
      left: -1px;
      top: -4px;
      height: 1.8em;
      margin-right: .8em;
      border-radius: 4px 0 0 4px;
    }
  `],
   providers: [JSONP_PROVIDERS,BucketService]
})
export class AppComponent {

  allbuckts = [];
  constructor(private buckService: BucketService) { 
  console.log('in construnctor ');
  
  buckService.getHeroes().subscribe(
            res => {
                this.allbuckts = res;
            }, 
            null, 
            () => { console.log(this.allbuckts); });
    
  }
  title = 'Tour of Buckets';
  buckets = MelonBuckets;
  selectedHero: Bucket;
  onSelect(sbucket: Bucket) 
  { this.selectedHero = sbucket; }
}
