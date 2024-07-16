import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, HttpResponse<any>>();

  get(req: HttpRequest<any>) {
    const url = req.urlWithParams;
    return this.cache.get(url) || null;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>) {
    const url = req.urlWithParams;
    this.cache.set(url, response);
  }
}
