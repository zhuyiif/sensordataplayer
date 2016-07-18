import { Component } from '@angular/core';
import { BucketService }        from './bucket.service';
import { JSONP_PROVIDERS }  from '@angular/http';

declare var Plotly: any;

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
    <input type="file" (change)="fileChangeEvent($event)" placeholder="Upload file..." />
    <button type="button" (click)="upload()">Upload</button>
    <div id="myDiv" style="width: 1000px; height: 400px;"><!-- Plotly chart will be drawn inside this DIV --></div>
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
  providers: [JSONP_PROVIDERS, BucketService]
})
export class AppComponent {

  allbuckts = [];
  leftChannel: any[];
  rightChannel: any[];
  channelIndex: any[];
  filesToUpload: Array<File>;
  constructor(private buckService: BucketService) {
    console.log('in construnctor ');
    this.filesToUpload = [];
    this.leftChannel = [];
    this.rightChannel = [];
    this.channelIndex = [];
    console.log(this.leftChannel);
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
  onSelect(sbucket: Bucket) {
    this.selectedHero = sbucket;
  }

  upload() {
    this.makeFileRequest("", [], this.filesToUpload);


  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    var formData: any = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append("uploads[]", files[i], files[i].name);
      console.log(files[i]);
    }

    if (files.length > 0) {
      var myReader: FileReader = new FileReader();

      var self = this;
      myReader.onloadend = function (e) {
        var lines = myReader.result.split("\n");
        lines.forEach(function (element, index, array) {
          var lineitem: any[] = element.split(/(\s+)/);
          self.leftChannel.push(lineitem[4]);
          self.rightChannel.push(lineitem[6]);
          self.channelIndex.push(lineitem[0]);
        }, self);


        var trace1 = {
          x: self.channelIndex.slice(0, 500),
          y: self.leftChannel.slice(0, 500),
          type: 'scatter'
        };

        var trace2 = {
          x: self.channelIndex.slice(0, 500),
          y: self.rightChannel.slice(0, 500),
          type: 'scatter'
        };

        var data = [trace1, trace2];

        Plotly.newPlot('myDiv', data);

      }


      myReader.readAsText(files[0]);

    }

  }
}
