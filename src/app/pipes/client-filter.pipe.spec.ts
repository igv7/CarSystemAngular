import { ClientFilterPipe } from './client-filter.pipe';
import { Client } from '../models/client';

describe('ClientFilterPipe', () => {
  const pipe = new ClientFilterPipe();
  const john = new Client(7, 'John', 'Smith', 'john_s', '123456789');
  const dana = new Client(8, 'Dana', 'Levi', 'dana.l', '987654321');
  // An older account from before names and identity numbers existed.
  const old = new Client(9, undefined, undefined, 'oldtimer', undefined);
  const clients = [john, dana, old];

  it('returns every client for an empty or blank filter', () => {
    expect(pipe.transform(clients, '')).toBe(clients);
    expect(pipe.transform(clients, null)).toBe(clients);
    expect(pipe.transform(clients, '   ')).toBe(clients);
  });

  it('matches the nickname, ignoring case', () => {
    expect(pipe.transform(clients, 'DANA.L')).toEqual([dana]);
  });

  it('matches the first name, the last name and the full name', () => {
    expect(pipe.transform(clients, 'john')).toEqual([john]);
    expect(pipe.transform(clients, 'levi')).toEqual([dana]);
    expect(pipe.transform(clients, 'john smith')).toEqual([john]);
  });

  it('matches the identity number, trimming the filter', () => {
    expect(pipe.transform(clients, ' 98765 ')).toEqual([dana]);
  });

  it('copes with clients that have no names or identity number', () => {
    expect(pipe.transform(clients, 'oldtimer')).toEqual([old]);
    expect(pipe.transform(clients, 'xyz')).toEqual([]);
  });
});
