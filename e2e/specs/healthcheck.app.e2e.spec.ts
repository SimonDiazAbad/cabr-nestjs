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

  it('Payments', async (done) => {
    ping(
      {
        address: 'payments',
        port: 3003,
      },
      (error, response) => {
        if (error) {
          fail(error);
        } else {
          console.log(response);
          expect(response).toBeTruthy();
          done();
        }
      },
    );
  });
});
