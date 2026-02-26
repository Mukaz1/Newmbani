/**
 * Takes an Express request and returns an object with the user's IP and User-Agent.
 * @param req The Express request.
 * @returns An object with the user's IP and User-Agent.
 */
export function RequestLogHelper(req: any): {
  ip: string;
  userAgent: string;
} {
  let { ip } = req;
  const ipQ: Array<any> = ip.split(':');
  ip = ipQ[ipQ.length - 1] == '1' ? '127.0.0.1' : ipQ[ipQ.length - 1];
  const reqQ: Array<string> = req.rawHeaders as Array<string>;
  const userAgentIndex: number = reqQ.indexOf('User-Agent');
  const userAgent = reqQ[userAgentIndex + 1];
  return { ip, userAgent };
}
