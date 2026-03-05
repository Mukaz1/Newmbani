export function URLEncodeParams(payload: any): string {
  return Object.keys(payload)
    .map(function (key) {
      if (payload[key]) {
        return [key, payload[key]].map(encodeURIComponent).join('=');
      }
    })
    .join('&');
}
