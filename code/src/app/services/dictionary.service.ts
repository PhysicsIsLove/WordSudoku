import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Definition, Meaning, WordMeaning } from '../model';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  private DICTIONARY_URL: string = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  constructor(private http: HttpClient) {   }

  getWordMeanings(word: string){
    return this.http.get<WordMeaning>(this.DICTIONARY_URL + word).pipe(
      map((response: any) => {      
        return {
          word: response[0].word,
          meanings: response[0].meanings.map((item: any) => {
            return {
              partOfSpeech: item.partOfSpeech,
              definitions: item.definitions.map((def: any) => { return {
                definition: def.definition,
                example: def.example
              }                
              })
            }            
          }),
        };
      }),
      catchError(this.handleError)
    );
  }

  handleError(error: any): Observable<any>{
    throw new Error(error.error.title);
  }
}
