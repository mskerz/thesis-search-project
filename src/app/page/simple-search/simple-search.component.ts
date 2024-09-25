import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  isSearched = false; // Add this to control
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
    private cacheService: CacheService,
    private route: ActivatedRoute // ใช้สำหรับดึง query params

  ) {}

  ngOnInit() {
    this.autocompleteQueries = this.cacheService.getQueryResults();
    
    this.route.queryParams.subscribe(params=>{
      this.field = params['field'] || ''; // ใช้ค่าจาก URL หรือค่าว่าง
      this.query = params['query'] || ''; // ใช้ค่าจาก URL หรือค่าว่าง
      if (this.field && this.query) {
        this.onSimpleSearch(); // ทำการค้นหาทันทีถ้ามีค่าใน field และ query
        
      }else {
        this.isSearched = false; // ถ้าไม่มีค่าให้เป็น false
        this.thesisList = []; // รีเซ็ตผลลัพธ์
        this.thesisLength = 0; // รีเซ็ตความยาวของผลลัพธ์
        console.log(this.thesisList);

      }
    })
  }

  onSimpleSearch() {
    this.isSearched = true
    if (this.field && this.query) {
      this.isLoading = true;

      
          // สร้าง URL ใหม่
      this.router.navigate(['/simple-search'], { queryParams: { field: this.field, query: this.query } });

      setTimeout(() => {
        this.search
          .SimpleSearch(this.field, this.query)
          .subscribe((data) => {
            this.isLoading = false; // Hide loader

            if (data.results) {
              try {
                this.thesisList = ThesisListConvert.fromJson_toThesis(
                  JSON.stringify(data.results)
                );
                this.thesisLength = this.thesisList.length;
                
                // อัปเดตการแบ่งหน้า
                this.updatePagination();
                // console.log(this.thesisList);

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
              // Swal.fire({
              //   icon: 'warning',
              //   text: 'ไม่พบปริญญานิพนธ์ที่คุณค้นหา',
              //   confirmButtonColor: '#34c968',
              // });
            }
          });
      }, 2000); // Delay of 2 seconds
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'คุณยังไม่ระบุคำค้นหา หรือ ประเภทข้อมูล!',
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
