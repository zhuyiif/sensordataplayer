import { Component } from '@angular/core';
import { BucketService }        from './bucket.service';
import { JSONP_PROVIDERS }  from '@angular/http';

import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import { FormBuilder, Validators } from '@angular/common';

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

  <style>
    .my-drop-zone { border: dotted 3px lightgray; }
    .nv-file-over { border: dotted 3px red; } /* Default class applied to drop zones on over */
    .another-file-over-class { border: dotted 3px green; }

    html, body { height: 100%; }
</style>

    <h1>{{title}}</h1>
    <h2>My buckets</h2>
     <div>
        <label>FilePath: </label>
        <input [(ngModel)]="bucketAndKey" placeholder="FilePath" (ngModelChange)="textChange($event)"/>
        <button type="button" (click)="submitFile()">Submit</button>
      </div>





    <form [ngFormModel]="uploadForm" (submit)="doUpload($event)">
    <input ngControl="file" name="sample" type="file" (change)="fileChangeEvent($event)">
    <input ngControl="email" type="email" placeholder="Your email">
  <button type="submit">upload</button>
</form>

    <div id="myDiv" style="width: 1000px; height: 400px;"><!-- Plotly chart will be drawn inside this DIV --></div>
    <div id="fft" style="width: 1000px; height: 400px;"><!-- Plotly chart will be drawn inside this DIV --></div>
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

  fft = [];
  rawdata = [];

  bucketAndKey = '';

  uploadForm ;
  constructor(private buckService: BucketService, fb: FormBuilder) {
    console.log('in construnctor ');
    this.filesToUpload = [];
    this.leftChannel = [];
    this.rightChannel = [];
    this.channelIndex = [];
    this.fft = [];
    this.rawdata = [];
    this.bucketAndKey = '';
    this.uploadForm = fb.group({
      file: ["", Validators.required],
      email:["", Validators.required]
    });
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
    this.makeFileRequest("http://192.168.74.241:9000/upload", [], this.filesToUpload);
  }

  submitFile() {
    console.log(this.bucketAndKey);
    //unprocessed-research-data/test_data/2016-07-14-070606-0700-dOff+heady-power-v2rev.txt
    this.buckService.getFFTResult(this.bucketAndKey).subscribe(
      res => {
        this.fft = res.frequency;
        this.rawdata = res.leftChannel;
      },
      null,
      () => {

        var frequ = [];
        var mag = [];
        var i;
        for (i = 0; i < this.fft.length; i++) {
          var item = this.fft[i];
          frequ.push(item.frequency);
          mag.push(item.magnitude);
        }

        var trace1 = {
          x: frequ,
          y: mag,
          type: 'scatter'
        };


        var data = [trace1];

        Plotly.newPlot('fft', data);


        var traceraw = {
          x: Array.from(Array(500).keys()),
          y: this.rawdata.slice(0, 500),
          type: 'scatter'
        };



        var dataraw = [traceraw];

        Plotly.newPlot('myDiv', dataraw);


      });

  }
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
   // console.log(this.filesToUpload);
  }

  onChange(fileInput: any) {
   // this.filesToUpload = <Array<File>>fileInput.target.files;
   console.log(fileInput.target.files);
   
  }

  textChange(textEvent: any) {

  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) : Promise<any> {
    
return new Promise((resolve, reject) => {

            console.log('tsdgsdfg');
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
          
            for(var i = 0; i < files.length; i++) {
                formData.append("sample", files[i], files[i].name);
            }
            console.log('33333');
            
            
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }

                }

              
            }
            xhr.open("POST", url, true);

            //xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(formData);
            console.log('testest zack');
            console.log(formData.get('uploads[]'));

            
        });
    }


   doUpload(event) {
     var email = this.uploadForm.controls.file.value;
    this.makeFileRequest("http://192.168.74.241:9000/upload", [], this.filesToUpload);
    console.log('testest zack1');
    console.log(this.filesToUpload);
    event.preventDefault();
  }
}
