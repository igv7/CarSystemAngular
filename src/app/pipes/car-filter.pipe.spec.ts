import { CarFilterPipe } from './car-filter.pipe';
import { Car } from '../models/car';

describe('CarFilterPipe', () => {
  const pipe = new CarFilterPipe();
  const cars: Car[] = [
    new Car(1, '111-11-111', 'RED', 'AUDI'),
    new Car(2, '222-22-222', 'BLACK', 'BMW'),
    new Car(3, '333-33-333', 'WHITE', 'VOLKSWAGEN'),
  ];

  it('returns every car for an empty or missing filter', () => {
    expect(pipe.transform(cars, '')).toBe(cars);
    expect(pipe.transform(cars, null)).toBe(cars);
    expect(pipe.transform(cars, undefined)).toBe(cars);
  });

  it('keeps cars whose type contains the text, ignoring case', () => {
    expect(pipe.transform(cars, 'bm').map(c => c.id)).toEqual([2]);
    expect(pipe.transform(cars, 'W').map(c => c.id)).toEqual([2, 3]);
    expect(pipe.transform(cars, 'swag').map(c => c.id)).toEqual([3]);
  });

  it('returns nothing when no type matches', () => {
    expect(pipe.transform(cars, 'toyota')).toEqual([]);
  });
});
