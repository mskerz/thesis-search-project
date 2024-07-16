import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '../services/Cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cache:CacheService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(request.method === 'GET'){
      return next.handle(request);
    }
    const cacheResponse = this.cache.get(request);
    if(cacheResponse){
      return of(cacheResponse);
    }
    return next.handle(request).pipe(
      tap(event=>{
        if(event instanceof HttpResponse){
          this.cache.put(request, event)
        }
      })
    )
    
  }
}
