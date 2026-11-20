import { HttpErrorResponse } from '@angular/common/http';
import { AppRoutes, brandLink, RoutePaths } from './app-routes';
import { loadErrorMessage, Messages } from './messages';
import { brandTitle } from './page-titles';

describe('constants', () => {

  describe('loadErrorMessage', () => {
    const status = (s: number) => new HttpErrorResponse({ status: s });

    it('says there is no connection for status 0 or no error', () => {
      expect(loadErrorMessage(status(0))).toBe(Messages.NO_CONNECTION);
      expect(loadErrorMessage(null)).toBe(Messages.NO_CONNECTION);
    });

    it('uses the "not found" text for 400 and 404 (an unknown id)', () => {
      expect(loadErrorMessage(status(400), Messages.wrongCarId(5))).toBe('Wrong car ID: 5. There is no such car!');
      expect(loadErrorMessage(status(404))).toBe(Messages.LOAD_FAILED);
    });

    it('says the server failed for other statuses', () => {
      expect(loadErrorMessage(status(500), 'not used')).toBe(Messages.SERVER_ERROR);
      expect(loadErrorMessage(status(503))).toBe(Messages.SERVER_ERROR);
    });
  });

  it('builds the parameterized messages', () => {
    expect(Messages.clientHasNoCarsUpTo(7, 150)).toBe('Client ID: 7 has no cars up to $150.');
    expect(Messages.wrongClientCarNumber(7, '999-99-999'))
      .toBe('Client ID: 7 has no car with number 999-99-999, or there is no such client!');
    expect(Messages.noCarsOfType('BMW')).toBe('There are no BMW cars.');
  });

  it('brandLink: lower case without spaces', () => {
    expect(brandLink('Mercedes')).toBe('/mercedes');
    expect(brandLink('VOLKS WAGEN')).toBe('/volkswagen');
  });

  it('builds absolute links from the route segments', () => {
    expect(AppRoutes.ADMIN_VIEW_ALL_CARS).toBe('/admin/view-all-cars');
    expect(AppRoutes.CLIENT_VIEW_MY_BALANCE).toBe('/client/view-my-balance');
    expect(RoutePaths.CAR_DETAILS).toBe('car-details');
  });

  it('brandTitle', () => {
    expect(brandTitle('AUDI')).toBe('AUDI cars');
  });
});
