import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserInformationCreate {
  name: string;
  age?: number | null;
  currentRoleStatusValue?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {
  private baseUrl = 'https://localhost:7247/api/userinformation'; // change to your API url

  constructor(private http: HttpClient) {}

  create(info: UserInformationCreate): Observable<any> {
    return this.http.post(this.baseUrl, info, { observe: 'body' });
  }
}
