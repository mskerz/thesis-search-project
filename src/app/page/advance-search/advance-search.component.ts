import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { ThesisList, ThesisListConvert } from 'src/app/models/thesisList.model';
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
  isSearched = false; // Add this to control
  paginatedThesis = new Array<ThesisList>();
  rowsPerPage =6;
   
  constructor(
    private search: SearchService,
    private router: Router,
    private cacheService: CacheService,
    private route: ActivatedRoute // ใช้สำหรับดึง query params
  ) {}

  ngOnInit() {
    this.autocompleteQueries = this.cacheService.getQueryResults();
    
    this.route.queryParams.subscribe(params=>{
      this.query = params['query'] || ''; // ใช้ค่าจาก URL หรือค่าว่าง
    
      if(this.query){
        this.onAdvancedSearch();
      }else {
        this.isSearched = false;
        this.thesisList = [];
        this.thesisLength = 0;

      }
    })
    

  }

  FormatScore(score: number | undefined): string {
    if (score === undefined) {
        return "0.0000"; // หรือคุณสามารถเลือกคืนค่าที่ต้องการในกรณีที่เป็น undefined
    }
    return score.toFixed(3);
}

  onAdvancedSearch() {
    this.isSearched = true;
    if (this.query) {
      this.isLoading = true;
      // Simulate a delay of 2 seconds before showing results
      this.router.navigate(['/advance-search'],{queryParams:{  query: this.query }})
      setTimeout(() => {
        this.search.AdvancedSearch(this.query).subscribe(
          (data) => {
            this.isLoading = false;

            if (data.results) {
              try {
                this.querys = data.query_terms;
                this.thesisList = ThesisListConvert.fromJson_toThesis(
                  JSON.stringify(data.results))
                this.thesisLength = this.thesisList.length;
                console.log(data);
                
                // อัปเดตการแบ่งหน้า
                this.updatePagination();
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
            } else{
              this.thesisLength = 0;
              this.thesisList = [];
              // Swal.fire({
              //   icon: 'warning',
              //   text: 'ไม่พบปริญญานิพนธ์ที่คุณค้นหา',
              //   confirmButtonColor: '#34c968',
              // });
            }
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
