/**
 * HTTP response status codes.
 * @see {@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes}
 */
export enum HttpStatusCodeEnum {
  /** Server received headers, customer should proceed with request body */
  CONTINUE = 100,

  /** Server agreed to switch protocols */
  SWITCHING_PROTOCOLS = 101,

  /** Server is processing request, no response available yet */
  PROCESSING = 102,

  /** Standard success response */
  OK = 200,

  /** Request fulfilled, new resource created */
  CREATED = 201,

  /** Request accepted but processing not completed */
  ACCEPTED = 202,

  /** Proxy returning modified version of origin's response */
  NON_AUTHORITATIVE_INFORMATION = 203,

  /** Request processed, no content returned */
  NO_CONTENT = 204,

  /** Request processed, document view should be reset */
  RESET_CONTENT = 205,

  /** Server delivering partial resource due to range header */
  PARTIAL_CONTENT = 206,

  /** XML message with multiple response codes */
  MULTI_STATUS = 207,

  /** DAV binding members already enumerated */
  ALREADY_REPORTED = 208,

  /** Response includes instance-manipulations result */
  IM_USED = 226,

  /** Multiple options available for resource */
  MULTIPLE_CHOICES = 300,

  /** Future requests should use new URI */
  MOVED_PERMANENTLY = 301,

  /** Temporary redirect (historically implemented as 303) */
  FOUND = 302,

  /** Response available at different URI using GET */
  SEE_OTHER = 303,

  /** Resource not modified since last request */
  NOT_MODIFIED = 304,

  /** Resource available only through proxy */
  USE_PROXY = 305,

  /** No longer used */
  SWITCH_PROXY = 306,

  /** Request should be repeated with different URI */
  TEMPORARY_REDIRECT = 307,

  /** Future requests should use different URI */
  PERMANENT_REDIRECT = 308,

  /** Client error in request */
  BAD_REQUEST = 400,

  /** Authentication required but failed */
  UNAUTHORIZED = 401,

  /** Reserved for future use */
  PAYMENT_REQUIRED = 402,

  /** Server refuses action */
  FORBIDDEN = 403,

  /** Resource not found */
  NOT_FOUND = 404,

  /** Method not supported for resource */
  METHOD_NOT_ALLOWED = 405,

  /** Content not acceptable per Accept headers */
  NOT_ACCEPTABLE = 406,

  /** Proxy authentication required */
  PROXY_AUTHENTICATION_REQUIRED = 407,

  /** Server timed out waiting for request */
  REQUEST_TIMEOUT = 408,

  /** Request conflict */
  CONFLICT = 409,

  /** Resource permanently removed */
  GONE = 410,

  /** Content length required */
  LENGTH_REQUIRED = 411,

  /** Precondition not met */
  PRECONDITION_FAILED = 412,

  /** Request too large */
  PAYLOAD_TOO_LARGE = 413,

  /** URI too long */
  URI_TOO_LONG = 414,

  /** Unsupported media type */
  UNSUPPORTED_MEDIA_TYPE = 415,

  /** Requested range not satisfiable */
  RANGE_NOT_SATISFIABLE = 416,

  /** Expect header requirements not met */
  EXPECTATION_FAILED = 417,

  /** April Fools' joke status code */
  I_AM_A_TEAPOT = 418,

  /** Server cannot produce response */
  MISDIRECTED_REQUEST = 421,

  /** Well-formed request with semantic errors */
  UNPROCESSABLE_ENTITY = 422,

  /** Resource is locked */
  LOCKED = 423,

  /** Previous request failed */
  FAILED_DEPENDENCY = 424,

  /** Protocol upgrade required */
  UPGRADE_REQUIRED = 426,

  /** Conditional request required */
  PRECONDITION_REQUIRED = 428,

  /** Too many requests */
  TOO_MANY_REQUESTS = 429,

  /** Header fields too large */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,

  /** Legal reasons prevent access */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  /** Generic server error */
  INTERNAL_SERVER_ERROR = 500,

  /** Method not implemented */
  NOT_IMPLEMENTED = 501,

  /** Invalid response from upstream server */
  BAD_GATEWAY = 502,

  /** Server temporarily unavailable */
  SERVICE_UNAVAILABLE = 503,

  /** Upstream server timeout */
  GATEWAY_TIMEOUT = 504,

  /** HTTP version not supported */
  HTTP_VERSION_NOT_SUPPORTED = 505,

  /** Circular reference in content negotiation */
  VARIANT_ALSO_NEGOTIATES = 506,

  /** Insufficient storage */
  INSUFFICIENT_STORAGE = 507,

  /** Infinite loop detected */
  LOOP_DETECTED = 508,

  /** Further extensions required */
  NOT_EXTENDED = 510,

  /** Network authentication required */
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}
