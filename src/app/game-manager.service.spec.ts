import { TestBed } from '@angular/core/testing';

import { GameManagerService } from './game-manager.service';

describe('GameManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameManagerService = TestBed.get(GameManagerService);
    expect(service).toBeTruthy();
  });
});
