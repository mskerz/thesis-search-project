import { ComponentFixture, TestBed,fakeAsync,getTestBed, tick  } from '@angular/core/testing';
import { SimpleSearchComponent } from './simple-search.component';
import { SearchService } from 'src/app/services/search.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { CacheService } from 'src/app/services/Cache.service';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting() 
  );
fdescribe('SimpleSearchComponent', () => {
  let component: SimpleSearchComponent;
  let fixture: ComponentFixture<SimpleSearchComponent>;
  let searchService: jasmine.SpyObj<SearchService>;

  beforeEach(async () => {
    const searchSpy = jasmine.createSpyObj('SearchService', ['SimpleSearch']);
    const cacheSpy = jasmine.createSpyObj('CacheService', ['getQueryResults', 'saveQuery']);

    await TestBed.configureTestingModule({
      declarations: [SimpleSearchComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        DropdownModule,
        AutoCompleteModule,
        PaginatorModule
      ],
      providers: [
        { provide: SearchService, useValue: searchSpy },
        { provide: CacheService, useValue: cacheSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleSearchComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call simple search with correct field and query',fakeAsync( () => {
    // Arrange
    component.field = 'title_th';
    component.query = 'เกม'; 
    const mockResponse = {
        message: "OK",
        status: 200,
        results: [
            {
                doc_id: 38,
                title_th: "เกม 15 นาที กับการเอาชีวิตรอด",
                author_name: "วัยวุฒิ นาโสม",
                advisor_name: "ผศ.ดร.จารุวัฒน์ ไพใหล",
                year: 2566,
            },
            {
                doc_id: 40,
                title_th: "เกมป้องกันหอคอยมอนสเตอร์",
                author_name: "สิทธิเดช คำรังสี",
                advisor_name: "ผศ.ดร.จารุวัฒน์ ไพใหล",
                year: 2566,
            },
        ]
    };
    searchService.SimpleSearch.and.returnValue(of(mockResponse));
  
    // Act
    component.onSimpleSearch();
    tick(2000); // Simulate the passing of time for setTimeout

    // Assert
    expect(searchService.SimpleSearch).toHaveBeenCalledWith('title_th', 'เกม');    
    expect(component.thesisList.length).toBe(2);

    expect(component.paginatedThesis[0].title_th).toBe('เกม 15 นาที กับการเอาชีวิตรอด');
    expect(component.paginatedThesis[1].title_th).toBe('เกมป้องกันหอคอยมอนสเตอร์');
  }));
  

  it('should handle no results found', () => {
    // Arrange
    component.field = 'title_th';
    component.query = 'สวัสดี';
    searchService.SimpleSearch.and.returnValue(of([]));

    // Act
    component.onSimpleSearch();

    // Assert
    expect(component.thesisList.length).toBe(0);
    expect(component.thesisLength).toBe(0);
  });

//   it('should show a warning if field or query is missing', () => {
//     spyOn(window, 'alert');

//     // กรณีที่ field ว่าง
//     component.field = '';
//     component.query = 'query';
//     component.onSimpleSearch();
//     expect(window.alert).toHaveBeenCalledWith('คุณยังไม่ได้ระบุ field ที่ค้นหา!');

//     // รีเซ็ตการเรียก alert
//     (window.alert as jasmine.Spy).calls.reset();

//     // กรณีที่ query ว่าง
//     component.field = 'title_th';
//     component.query = '';
//     component.onSimpleSearch();
//     expect(window.alert).toHaveBeenCalledWith('คุณยังไม่ได้ระบุคำค้นหา');
//   });

  it('should NOT show a warning if field and query are both provided', () => {
    spyOn(window, 'alert');
    component.field = 'title_th';
    component.query = 'query';

    component.onSimpleSearch();

    expect(window.alert).not.toHaveBeenCalled();
  });

   
});
