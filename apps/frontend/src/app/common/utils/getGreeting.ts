export const getGreeting = (): string => {
  const data = [
    [0, 11, 'Good morning'],
    [12, 17, 'Good afternoon'],
    [18, 21, 'Good evening'],
    [22, 24, 'Good night'],
  ];

  const hour: number = new Date().getHours();
  let greeting = 'Hello';
  for (let i = 0; i < data.length; i++) {
    const min: number = +data[i][0];
    const max: number = +data[i][1];
    if (hour >= min && hour <= max) {
      greeting = data[i][2] as string;
    }
  }

  return greeting;
};
