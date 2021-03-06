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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/catch');
var BucketService = (function () {
    function BucketService(http) {
        this.http = http;
        this.heroesUrl = 'http://192.168.74.241:9000/'; // URL to web API
        this.channelDataUrl = 'http://192.168.74.241:9000/bucket/test_data/2016-07-14-070606-0700-dOff+heady-power-v2rev.txt';
    }
    BucketService.prototype.getHeroes = function () {
        return this.http.get(this.heroesUrl).map(function (res) { return res.json(); });
    };
    BucketService.prototype.getFFTResult = function (filepath) {
        var url = this.heroesUrl + filepath;
        return this.http.get(url).map(function (res) { return res.json(); });
    };
    BucketService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    BucketService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], BucketService);
    return BucketService;
}());
exports.BucketService = BucketService;
//# sourceMappingURL=bucket.service.js.map