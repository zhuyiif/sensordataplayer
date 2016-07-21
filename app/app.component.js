"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var bucket_service_1 = require('./bucket.service');
var http_1 = require('@angular/http');
var common_1 = require('@angular/common');
var Bucket = (function () {
    function Bucket() {
    }
    return Bucket;
}());
exports.Bucket = Bucket;
var MelonBuckets = [
    { CreationDate: '11', Name: 'Mr. Nice' },
    { CreationDate: '12', Name: 'Narco' },
    { CreationDate: '13', Name: 'Bombasto' },
    { CreationDate: '20', Name: 'Tornado' }
];
var AppComponent = (function () {
    function AppComponent(buckService, fb) {
        var _this = this;
        this.buckService = buckService;
        this.allbuckts = [];
        this.fft = [];
        this.rawdata = [];
        this.bucketAndKey = '';
        this.title = 'Tour of Buckets';
        this.buckets = MelonBuckets;
        console.log('in construnctor ');
        this.filesToUpload = [];
        this.leftChannel = [];
        this.rightChannel = [];
        this.channelIndex = [];
        this.fft = [];
        this.rawdata = [];
        this.bucketAndKey = '';
        this.uploadForm = fb.group({
            file: ["", common_1.Validators.required],
            email: ["", common_1.Validators.required]
        });
        buckService.getHeroes().subscribe(function (res) {
            _this.allbuckts = res;
        }, null, function () { console.log(_this.allbuckts); });
    }
    AppComponent.prototype.onSelect = function (sbucket) {
        this.selectedHero = sbucket;
    };
    AppComponent.prototype.upload = function () {
        this.makeFileRequest("http://192.168.74.241:9000/upload", [], this.filesToUpload);
    };
    AppComponent.prototype.submitFile = function () {
        var _this = this;
        console.log(this.bucketAndKey);
        //unprocessed-research-data/test_data/2016-07-14-070606-0700-dOff+heady-power-v2rev.txt
        this.buckService.getFFTResult(this.bucketAndKey).subscribe(function (res) {
            _this.fft = res.frequency;
            _this.rawdata = res.leftChannel;
        }, null, function () {
            var frequ = [];
            var mag = [];
            var i;
            for (i = 0; i < _this.fft.length; i++) {
                var item = _this.fft[i];
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
                y: _this.rawdata.slice(0, 500),
                type: 'scatter'
            };
            var dataraw = [traceraw];
            Plotly.newPlot('myDiv', dataraw);
        });
    };
    AppComponent.prototype.fileChangeEvent = function (fileInput) {
        this.filesToUpload = fileInput.target.files;
        // console.log(this.filesToUpload);
    };
    AppComponent.prototype.onChange = function (fileInput) {
        // this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(fileInput.target.files);
    };
    AppComponent.prototype.textChange = function (textEvent) {
    };
    AppComponent.prototype.makeFileRequest = function (url, params, files) {
        return new Promise(function (resolve, reject) {
            console.log('tsdgsdfg');
            var formData = new FormData();
            var xhr = new XMLHttpRequest();
            for (var i = 0; i < files.length; i++) {
                formData.append("sample", files[i], files[i].name);
            }
            console.log('33333');
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    }
                    else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open("POST", url, true);
            //xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(formData);
            console.log('testest zack');
            console.log(formData.get('uploads[]'));
        });
    };
    AppComponent.prototype.doUpload = function (event) {
        var email = this.uploadForm.controls.file.value;
        this.makeFileRequest("http://192.168.74.241:9000/upload", [], this.filesToUpload);
        console.log('testest zack1');
        console.log(this.filesToUpload);
        event.preventDefault();
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n\n  <style>\n    .my-drop-zone { border: dotted 3px lightgray; }\n    .nv-file-over { border: dotted 3px red; } /* Default class applied to drop zones on over */\n    .another-file-over-class { border: dotted 3px green; }\n\n    html, body { height: 100%; }\n</style>\n\n    <h1>{{title}}</h1>\n    <h2>My buckets</h2>\n     <div>\n        <label>FilePath: </label>\n        <input [(ngModel)]=\"bucketAndKey\" placeholder=\"FilePath\" (ngModelChange)=\"textChange($event)\"/>\n        <button type=\"button\" (click)=\"submitFile()\">Submit</button>\n      </div>\n\n\n\n\n\n    <form [ngFormModel]=\"uploadForm\" (submit)=\"doUpload($event)\">\n    <input ngControl=\"file\" name=\"sample\" type=\"file\" (change)=\"fileChangeEvent($event)\">\n    <input ngControl=\"email\" type=\"email\" placeholder=\"Your email\">\n  <button type=\"submit\">upload</button>\n</form>\n\n    <div id=\"myDiv\" style=\"width: 1000px; height: 400px;\"><!-- Plotly chart will be drawn inside this DIV --></div>\n    <div id=\"fft\" style=\"width: 1000px; height: 400px;\"><!-- Plotly chart will be drawn inside this DIV --></div>\n    <ul class=\"buckets\">\n      <li *ngFor=\"let buck of allbuckts\"\n        [class.selected]=\"buck === selectedHero\"\n        (click)=\"onSelect(buck)\">\n        <span class=\"badge\">{{buck.Name}}</span> {{buck.CreationDate}}\n      </li>\n    </ul>\n    <div *ngIf=\"selectedHero\">\n      <h2>{{selectedHero.Name}} details!</h2>\n      <div><label>CreationDate: </label>{{selectedHero.CreationDate}}</div>\n      <div>\n        <label>Name: </label>\n        <input [(ngModel)]=\"selectedHero.Name\" placeholder=\"Name\"/>\n      </div>\n    </div>\n  ",
            styles: ["\n    .selected {\n      background-color: #CFD8DC !important;\n      color: white;\n    }\n    .buckets {\n      margin: 0 0 2em 0;\n      list-style-type: none;\n      padding: 0;\n      width: 15em;\n    }\n    .buckets li {\n      cursor: pointer;\n      position: relative;\n      left: 0;\n      background-color: #EEE;\n      margin: .5em;\n      padding: .3em 0;\n      height: 1.6em;\n      border-radius: 4px;\n    }\n    .buckets li.selected:hover {\n      background-color: #BBD8DC !important;\n      color: white;\n    }\n    .buckets li:hover {\n      color: #607D8B;\n      background-color: #DDD;\n      left: .1em;\n    }\n    .buckets .text {\n      position: relative;\n      top: -3px;\n    }\n    .heroes .badge {\n      display: inline-block;\n      font-size: small;\n      color: white;\n      padding: 0.8em 0.7em 0 0.7em;\n      background-color: #607D8B;\n      line-height: 1em;\n      position: relative;\n      left: -1px;\n      top: -4px;\n      height: 1.8em;\n      margin-right: .8em;\n      border-radius: 4px 0 0 4px;\n    }\n  "],
            providers: [http_1.JSONP_PROVIDERS, bucket_service_1.BucketService]
        }), 
        __metadata('design:paramtypes', [bucket_service_1.BucketService, common_1.FormBuilder])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map