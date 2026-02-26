/**
 * Generate a unique batch number
 *
 * @export
 * @return {*}  {string}
 */
function makeid(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

/**
 *
 *
 * @export
 * @return {*}  {string}
 */
export function generateUniqueBatchNumber(): string {
  // generate a unique batch number
  const batchNo =
    makeid(3).toUpperCase() +
    Date.now() +
    new Date().getMilliseconds() +
    makeid(5).toUpperCase() +
    new Date().getSeconds();

  return batchNo;
}
