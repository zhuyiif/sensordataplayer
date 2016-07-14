import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Bucket } from './app.component';
import 'rxjs/add/operator/catch';
import { Jsonp, URLSearchParams } from '@angular/http';

@Injectable()
export class BucketService {

  constructor(private http: Http) {}
  private heroesUrl = 'http://localhost:9000/';  // URL to web API
  getHeroes () {
    return this.http.get(this.heroesUrl).map(res => res.json());
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
