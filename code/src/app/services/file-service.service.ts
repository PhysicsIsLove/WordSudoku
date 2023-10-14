import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  constructor(private http: HttpClient) {}

  getFileContent(filePath: string) {
    return this.http.get(filePath, { responseType: 'text' });
  }
}




