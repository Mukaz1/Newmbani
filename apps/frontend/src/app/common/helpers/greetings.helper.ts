export function getGreeting(): string {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good Afternoon';
  } else if (hour >= 18 && hour < 22) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
}
