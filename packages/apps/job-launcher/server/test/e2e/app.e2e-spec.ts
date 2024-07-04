import request from 'supertest';
import { BASE_URL } from '../../test/constants';

describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    return request(BASE_URL)
      .get('/')
      .expect(301)
      .expect('Moved Permanently. Redirecting to /swagger');
  });
});
