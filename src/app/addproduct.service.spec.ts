import { TestBed, inject } from '@angular/core/testing';

import { AddproductService } from './addproduct.service';

describe('AddproductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddproductService]
    });
  });

  it('should ...', inject([AddproductService], (service: AddproductService) => {
    expect(service).toBeTruthy();
  }));
});
