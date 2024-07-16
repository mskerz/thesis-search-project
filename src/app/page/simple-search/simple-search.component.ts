import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThesisList, ThesisListConvert } from 'src/app/models/thesisList.model';
import { SearchService } from 'src/app/services/search.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-simple-search',
  templateUrl: './simple-search.component.html',
  styleUrls: ['./simple-search.component.scss']
})
export class SimpleSearchComponent implements OnInit {
  query:string = '';
  field:string = '';
  thesisList = new Array<ThesisList>();
  page:number =1;
  thesisLength = 0;
   constructor(private search:SearchService,private router: Router){
   }

   ngOnInit() {
    const storedThesisList = sessionStorage.getItem('thesisList');
    if (storedThesisList) {
      try {
        this.thesisList = ThesisListConvert.fromJson_toThesis(storedThesisList);
        this.thesisLength = this.thesisList.length;
      } catch (e) {
        console.error("Failed to load stored thesis list:", e);
        this.thesisList = [];
        this.thesisLength = 0;
      }
    } else {
      this.thesisList = [];
      this.thesisLength = 0;
    }
  }
  
  
  onSimpleSearch() {
    if (this.field && this.query) {
      this.search.SimpleSearch(this.field, this.query).subscribe(
        (data: any) => {
          if (data && data.results) {
            try {
              this.thesisList = ThesisListConvert.fromJson_toThesis(JSON.stringify(data.results));
              this.thesisLength = this.thesisList.length;
              sessionStorage.setItem('thesisList', JSON.stringify(this.thesisList));
              console.log(this.thesisList);
            } catch (e) {
              console.error("Failed to process results:", e);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to process results. Please try again later.'
              });
            }
          } else {
            Swal.fire({
              icon: 'warning',
              text: 'No results found!',
              confirmButtonColor:'#34c968',
            });
          }
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'คุณกรอกข้อมูลไม่ครบ!',
        confirmButtonColor:'#34c968'
      });
    }
  }
  
  

  openLinkInNewTab(url: string) {
    const fullUrl = this.router.serializeUrl(this.router.createUrlTree([url]));
    window.open(fullUrl, '_blank');
  }
   

  
 
  
  
}
