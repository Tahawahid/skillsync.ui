import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonalInfoData, UpdatePersonalInfoRequest, UpdatePersonalInfoResponse } from '../models/personal-info.models';

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoService {
  private readonly API_URL = 'https://localhost:7247/api/personalinfo';

  constructor(private http: HttpClient) {}

  getUserInfo(userId: number): Observable<PersonalInfoData> {
    console.log('Getting user info for ID:', userId);
    return this.http.get<PersonalInfoData>(`${this.API_URL}/${userId}`);
  }

  updateUserInfo(userId: number, updateData: UpdatePersonalInfoRequest): Observable<UpdatePersonalInfoResponse> {
    console.log('Updating user info for ID:', userId, 'Data:', updateData);
    return this.http.put<UpdatePersonalInfoResponse>(`${this.API_URL}/${userId}`, updateData);
  }
}