import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThesisList, ThesisListConvert } from 'src/app/models/thesisList.model';
import { SearchService } from 'src/app/services/search.service';
import { CacheService } from 'src/app/services/Cache.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-simple-search',
  templateUrl: './simple-search.component.html',
  styleUrls: ['./simple-search.component.scss'],
})
export class SimpleSearchComponent implements OnInit {
  query: string = '';
  field: string = '';
  thesisList = new Array<ThesisList>();
  page: number = 1;
  thesisLength = 0;
  autocompleteQueries: string[] = [];
  filteredQueries: string[] = [];
  suggestionsVisible: boolean = false; // Add this to control visibility
  isLoading: boolean = false; // Add this to control loader visibility
  querys: string[] = [];

  rowsPerPage =6;
  paginatedThesis = new Array<ThesisList>();

  fields: { label: string; value: string }[] = [
    { label: 'หัวข้อ (ไทย)', value: 'title_th' },
    { label: 'หัวข้อ (อังกฤษ)', value: 'title_en' },
    { label: 'ชื่อผู้เขียน', value: 'author_name' },
    { label: 'อาจารย์ที่ปรึกษา', value: 'advisor_name' },
    { label: 'ปีการศึกษา', value: 'year' },
  ];
  constructor(
    private search: SearchService,
    private router: Router,
    private cacheService: CacheService
  ) {}

  ngOnInit() {
    this.autocompleteQueries = this.cacheService.getQueryResults();
     
  }

  onSimpleSearch() {
    if (this.field && this.query) {
      this.isLoading = true;
      setTimeout(() => {
        this.search
          .SimpleSearch(this.field, this.query)
          .subscribe((data: any) => {
            this.isLoading = false; // Hide loader

            if (data && data.results) {
              try {
                this.thesisList = ThesisListConvert.fromJson_toThesis(
                  JSON.stringify(data.results)
                );
                this.thesisLength = this.thesisList.length;
                // อัปเดตการแบ่งหน้า
                this.updatePagination();
                console.log(this.thesisList);

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
            } else {
              this.thesisLength = 0;
              this.thesisList = [];
              Swal.fire({
                icon: 'warning',
                text: 'ไม่พบปริญญานิพนธ์ที่คุณค้นหา',
                confirmButtonColor: '#34c968',
              });
            }
          });
      }, 2000); // Delay of 2 seconds
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'คุณกรอกข้อมูลไม่ครบ!',
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

  highlight(text: string): string {
    let highlightedText = text;
    this.querys.forEach((term) => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    return highlightedText;
  }


  onPageChange(event: any): void {
    this.page = event.page + 1; // PrimeNG paginator starts from 0
    this.updatePagination();
  }
  updatePagination(): void {
    const startIndex = (this.page - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedThesis = this.thesisList.slice(startIndex, endIndex);
  }
}
