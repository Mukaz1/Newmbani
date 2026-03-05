export function checkDistinct(array: string[]): boolean {
  const outputArray = [];

  // Count variable is used to add the
  // new unique value only once in the
  // outputArray.
  let count = 0;

  // Start variable is used to set true
  // if a repeated duplicate value is
  // encontered in the output array.
  let start = false;

  for (let j = 0; j < array.length; j++) {
    for (let k = 0; k < outputArray.length; k++) {
      if (array[j] === outputArray[k]) {
        start = true;
      }
    }
    count++;
    if (count === 1 && start === false) {
      outputArray.push(array[j]);
    }
    start = false;
    count = 0;
  }

  return outputArray.length > 1 ? false : true;
}
