import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _tagsHistory : string[] = [];
  private apiKey       : string   = 'VKp3orPIBDxrZLacGdqnBzhDYAJxOYtq';
  private serviceUrl   : string   = 'https://api.giphy.com/v1/gifs';

  public gifList: Gif[] = [];

  constructor( private http: HttpClient ) { }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizeTag( tag: string ): void {
    tag = tag.toLowerCase();

    if( this._tagsHistory.includes( tag ) ) {
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag );
    }
    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0, 10);
  }

  searchTag( tag: string ): void {
    if ( !tag ) return;

    this.organizeTag( tag );

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag);

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe( response => {
        this.gifList = response.data;
      })
  }

}
