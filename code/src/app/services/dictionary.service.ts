import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  private DICTIONARY_URL: string = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  constructor(private http: HttpClient) {   }

  getWordMeanings(word: string){
    return this.http.get(this.DICTIONARY_URL + word);
  }
}
