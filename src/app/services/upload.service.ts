import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private httpClient: HttpClient) { }

  uploadFile2(file) {
    const formData = new FormData();
    const name = sessionStorage.getItem('user') + '.ics';
    const headers = new HttpHeaders({'Content-Type': 'multipart/form-data'});
    formData.append('file', file, name);
    return this.httpClient.post('./assets/handleFile.php', formData, {
      headers,
      responseType: 'text'
    });
  }

  uploadFile(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    const name = sessionStorage.getItem('user') + '.ics';
    formdata.append('file', file);
    const req = new HttpRequest('POST', './assets/handleFile.php?nomfichier=' + name, formdata, {
      responseType: 'text'
    });
    return this.httpClient.request(req);

  }
}
