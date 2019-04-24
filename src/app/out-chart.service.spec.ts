import { TestBed } from '@angular/core/testing';

import { OutChartService } from './out-chart.service';

describe('OutChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OutChartService = TestBed.get(OutChartService);
    expect(service).toBeTruthy();
  });
});
