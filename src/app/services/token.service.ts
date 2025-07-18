import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  private storageKey='access_token';

  savToken(token:string):void{
    const hashedToken=CryptoJS.SHA256(token).toString();
    localStorage.setItem(this.storageKey,hashedToken)
  }

  getHashedToken():string | null{

    return localStorage.getItem(this.storageKey);
  }

  isTokenMatch(tokenToCompare:string):boolean{
    const StoredHashedToken=this.getHashedToken();
    const haShedIncomming=CryptoJS.SHA256(tokenToCompare).toString();

    return StoredHashedToken === haShedIncomming;
  }

  clearToken():void{
    localStorage.removeItem(this.storageKey)
  }



}
