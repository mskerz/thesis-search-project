import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

interface CacheEntry {
  url: string;
  response: HttpResponse<any>;
  entryTime: number;
  maxAge: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cacheMap = new Map<string, CacheEntry>();
  private localStorageKey = 'queryCache'; // Key for localStorage

  get(request: HttpRequest<any>): HttpResponse<any> | null {
    const cacheEntry = this.cacheMap.get(request.urlWithParams);

    if (!cacheEntry) {
      return null;
    }

    const isExpired = (Date.now() - cacheEntry.entryTime) > cacheEntry.maxAge;
    if (isExpired) {
      this.cacheMap.delete(request.urlWithParams);
      return null;
    }

    return cacheEntry.response;
  }

  put(request: HttpRequest<any>, response: HttpResponse<any>, maxAge: number = 300000): void {
    const cacheEntry: CacheEntry = {
      url: request.urlWithParams,
      response: response,
      entryTime: Date.now(),
      maxAge: maxAge
    };
    this.cacheMap.set(request.urlWithParams, cacheEntry);
  }

  saveQuery(query: string): void {
    // Retrieve current cache from localStorage
    const cachedQueries = this.getCachedQueries();
    // Store the query in localStorage
    cachedQueries[query] = true;
    // Save updated cache to localStorage
    localStorage.setItem(this.localStorageKey, JSON.stringify(cachedQueries));
  }

  getQueryResults(): string[] {
    const cachedQueries = this.getCachedQueries();
    return Object.keys(cachedQueries);
  }

  private getCachedQueries(): Record<string, boolean> {
    const cachedData = localStorage.getItem(this.localStorageKey);
    return cachedData ? JSON.parse(cachedData) : {};
  }

  clearCache(): void {
    this.cacheMap.clear();
    localStorage.removeItem(this.localStorageKey);
  }
}
