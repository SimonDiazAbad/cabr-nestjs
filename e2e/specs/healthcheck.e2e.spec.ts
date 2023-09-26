import { ping } from 'tcp-ping';

describe('Health', () => {
  it('Reservations', async () => {
    const response = await fetch('http://reservations:3000');
    expect(response.ok).toBeTruthy();
  });

  it('Auth', async () => {
    const response = await fetch('http://auth:3001');
    expect(response.ok).toBeTruthy();
  });

  it('Payments', (done) => {
    ping(
      {
        address: 'payments',
        port: 3003,
      },
      (error) => {
        if (error) {
          fail();
        }
        done();
      },
    );
  });

  it('Notifications', (done) => {
    ping(
      {
        address: 'notifications',
        port: 3004,
      },
      (error) => {
        if (error) {
          fail();
        }
        done();
      },
    );
  });
});
