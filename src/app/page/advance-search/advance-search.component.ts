import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { ThesisList } from 'src/app/models/thesisList.model';
import Swal from 'sweetalert2';
import { CacheService } from 'src/app/services/Cache.service';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss'],
})
export class AdvanceSearchComponent implements OnInit {
  query: string = '';
  thesisList: ThesisList[] = [];
  page: number = 1;
  thesisLength = 0;
  isLoading: boolean = false;
  suggestionsVisible: boolean = false; // Add this to control visibility
  autocompleteQueries: string[] = [];
  filteredQueries: string[] = [];
  querys: string[] = [];
  hasResults: boolean = true;
  constructor(
    private search: SearchService,
    private router: Router,
    private cacheService: CacheService
  ) {}

  ngOnInit() {
    this.autocompleteQueries = this.cacheService.getQueryResults();
  }

  onAdvancedSearch() {
    if (this.query) {
      this.isLoading = true;

      // Simulate a delay of 2 seconds before showing results
      setTimeout(() => {
        this.search.AdvancedSearch(this.query).subscribe(
          (data: any) => {
            this.isLoading = false;

            if (data && data.results) {
              try {
                this.querys = data.query_terms;
                this.thesisList = data.results;
                this.thesisLength = this.thesisList.length;
                // Save the query for autocomplete
                this.cacheService.saveQuery(this.query);
                this.autocompleteQueries = this.cacheService.getQueryResults();
              } catch (e) {
                console.error('Failed to process results:', e);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to process results. Please try again later.',
                });
              }
            } else if (data.status === 404) {
              Swal.fire({
                icon: 'warning',
                text: 'ไม่พบปริญญานิพนธ์ที่คุณค้นหา',
                confirmButtonColor: '#34c968',
              });
            }
          },
          (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred. Please try again later.',
            });
          }
        );
      }, 2000); // Delay of 2 seconds
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'กรุณาระบุคำค้นหา!',
        confirmButtonColor: '#34c968',
      });
    }
  }
  filterQueries(event: any) {
    const query = event.query.toLowerCase();
    this.filteredQueries = this.autocompleteQueries.filter((q) =>
      q.toLowerCase().includes(query)
    );
  }

  openLinkInNewTab(url: string) {
    const fullUrl = this.router.serializeUrl(this.router.createUrlTree([url]));
    window.open(fullUrl, '_blank');
  }

  // ฟังก์ชันที่ใช้ในการทำไฮไลต์คำที่ตรงกับ query_terms
  highlight(text: string): string {
    let highlightedText = text;
    this.querys.forEach((term) => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    return highlightedText;
  }
}
