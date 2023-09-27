describe('Reservations', () => {
  let jwt: string;

  beforeAll(async () => {
    const user = {
      email: 'cabrservicesapp@gmail.com',
      password: 'GoodPassword123!@',
    };

    await fetch('http://auth:3001/auth/users', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    jwt = await response.text();
  });

  it('Create', async () => {
    const createdReservationResponse = await createReservation();
    expect(createdReservationResponse.ok).toBeTruthy();
  });

  it('Get', async () => {
    const createdReservationResponse = await createReservation();
    const createdReservation = await createdReservationResponse.json();

    const foundReservationResponse = await fetch(
      `http://reservations:3000/reservations/${createdReservation._id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authentication: jwt,
        },
      },
    );

    const foundReservation = await foundReservationResponse.json();

    expect(foundReservationResponse.ok).toBeTruthy();
    expect(foundReservation._id).toEqual(createdReservation._id);
  });

  const createReservation = async () => {
    const response = await fetch('http://reservations:3000/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: jwt,
      },
      body: JSON.stringify({
        startDate: '12/20/2022',
        endDate: '12/25/2022',
        placeId: '123112223',
        invoiceId: '123',
        charge: {
          amount: 13,
          card: {
            cvc: '130',
            exp_month: 1,
            exp_year: 2028,
            number: '4242424242424242',
          },
        },
      }),
    });

    return response;
  };
});
