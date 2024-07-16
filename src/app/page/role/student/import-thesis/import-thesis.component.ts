import { Component } from '@angular/core';

@Component({
  selector: 'app-import-thesis',
  templateUrl: './import-thesis.component.html',
  styleUrls: ['./import-thesis.component.scss']
})
export class ImportThesisComponent {


  form_import ={
    title_th:'',
    title_en:'',
    advisor_id:0,
    year:2566,
    file:null,
  }

  constructor(){

  }



  // ImportThesis(form_import:any){
  //   if(form_import){
  //     console.log(form_import)
  //   }else{
  //     alert('กรุณากรอกข้อมูลให้ครับ')
  //   }
  // }
}
