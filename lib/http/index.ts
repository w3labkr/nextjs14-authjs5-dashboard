import { NextResponse } from 'next/server'

type API = { success: boolean; status: string; message: string; data: any }

class ApiResponse extends Response {
  static json(body: any, init?: ResponseInit): NextResponse<API> {
    const { message, ...data } = body ?? {}
    const code = init?.status ?? STATUS_CODES.OK
    const statusText = init?.statusText ?? STATUS_CODE_TO_TEXT[code?.toString()]
    const ok = code >= 200 && code <= 299
    const newBody = {
      success: ok,
      status: ok ? 'success' : 'fail',
      message: message ?? statusText,
      data: body === null || body === undefined ? null : data,
    }
    const response = Response.json(newBody, init)
    return new NextResponse(response.body, response)
  }
}

/**
 * http-status-codes
 *
 * Constants enumerating the HTTP status codes. Based on the Java Apache HttpStatus API.
 * All status codes defined in RFC1945 (HTTP/1.0), RFC2616 (HTTP/1.1), RFC2518 (WebDAV), RFC6585 (Additional HTTP Status Codes), and RFC7538 (Permanent Redirect) are supported.
 *
 * @link https://github.com/prettymuchbryce/http-status-codes
 */

// prettier-ignore
const STATUS_CODES = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  EARLY_HINTS: 103,

  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,

  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  MOVED_TEMPORARILY: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_TOO_LONG: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  IM_A_TEAPOT: 418,
  INSUFFICIENT_SPACE_ON_RESOURCE: 419,
  METHOD_FAILURE: 420,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  INSUFFICIENT_STORAGE: 507,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
}

// prettier-ignore
const STATUS_TEXTS = {
  CONTINUE: "Continue",
  SWITCHING_PROTOCOLS: "Switching Protocols",
  PROCESSING: "Processing",
  EARLY_HINTS: "Early Hints",

  OK: "OK",
  CREATED: "Created",
  ACCEPTED: "Accepted",
  NON_AUTHORITATIVE_INFORMATION: "Non Authoritative Information",
  NO_CONTENT: "No Content",
  RESET_CONTENT: "Reset Content",
  PARTIAL_CONTENT: "Partial Content",
  MULTI_STATUS: "Multi-Status",

  MULTIPLE_CHOICES: "Multiple Choices",
  MOVED_PERMANENTLY: "Moved Permanently",
  MOVED_TEMPORARILY: "Moved Temporarily",
  SEE_OTHER: "See Other",
  NOT_MODIFIED: "Not Modified",
  USE_PROXY: "Use Proxy",
  TEMPORARY_REDIRECT: "Temporary Redirect",
  PERMANENT_REDIRECT: "Permanent Redirect",

  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  PAYMENT_REQUIRED: "Payment Required",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  METHOD_NOT_ALLOWED: "Method Not Allowed",
  NOT_ACCEPTABLE: "Not Acceptable",
  PROXY_AUTHENTICATION_REQUIRED: "Proxy Authentication Required",
  REQUEST_TIMEOUT: "Request Timeout",
  CONFLICT: "Conflict",
  GONE: "Gone",
  LENGTH_REQUIRED: "Length Required",
  PRECONDITION_FAILED: "Precondition Failed",
  REQUEST_TOO_LONG: "Request Entity Too Large",
  REQUEST_URI_TOO_LONG: "Request-URI Too Long",
  UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",
  REQUESTED_RANGE_NOT_SATISFIABLE: "Requested Range Not Satisfiable",
  EXPECTATION_FAILED: "Expectation Failed",
  IM_A_TEAPOT: "I'm a teapot",
  INSUFFICIENT_SPACE_ON_RESOURCE: "Insufficient Space on Resource",
  METHOD_FAILURE: "Method Failure",
  MISDIRECTED_REQUEST: "Misdirected Request",
  UNPROCESSABLE_ENTITY: "Unprocessable Entity",
  LOCKED: "Locked",
  FAILED_DEPENDENCY: "Failed Dependency",
  UPGRADE_REQUIRED: "Upgrade Required",
  PRECONDITION_REQUIRED: "Precondition Required",
  TOO_MANY_REQUESTS: "Too Many Requests",
  REQUEST_HEADER_FIELDS_TOO_LARGE: "Request Header Fields Too Large",
  UNAVAILABLE_FOR_LEGAL_REASONS: "Unavailable For Legal Reasons",

  INTERNAL_SERVER_ERROR: "Internal Server Error",
  NOT_IMPLEMENTED: "Not Implemented",
  BAD_GATEWAY: "Bad Gateway",
  SERVICE_UNAVAILABLE: "Service Unavailable",
  GATEWAY_TIMEOUT: "Gateway Timeout",
  HTTP_VERSION_NOT_SUPPORTED: "HTTP Version Not Supported",
  INSUFFICIENT_STORAGE: "Insufficient Storage",
  NETWORK_AUTHENTICATION_REQUIRED: "Network Authentication Required",
}

// prettier-ignore
const STATUS_CODE_TO_TEXT: Record<string, string> = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "103": "Early Hints",

  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",

  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Moved Temporarily",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",

  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Request Entity Too Large",
  "414": "Request-URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Requested Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "419": "Insufficient Space on Resource",
  "420": "Method Failure",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",

  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "507": "Insufficient Storage",
  "511": "Network Authentication Required",
}

// prettier-ignore
const STATUS_TEXT_TO_CODE: Record<string, string> = {
  "Continue": "100",
  "Switching Protocols": "101",
  "Processing": "102",
  "Early Hints": "103",

  "OK": "200",
  "Created": "201",
  "Accepted": "202",
  "Non Authoritative Information": "203",
  "No Content": "204",
  "Reset Content": "205",
  "Partial Content": "206",
  "Multi-Status": "207",

  "Multiple Choices": "300",
  "Moved Permanently": "301",
  "Moved Temporarily": "302",
  "See Other": "303",
  "Not Modified": "304",
  "Use Proxy": "305",
  "Temporary Redirect": "307",
  "Permanent Redirect": "308",

  "Bad Request": "400",
  "Unauthorized": "401",
  "Payment Required": "402",
  "Forbidden": "403",
  "Not Found": "404",
  "Method Not Allowed": "405",
  "Not Acceptable": "406",
  "Proxy Authentication Required": "407",
  "Request Timeout": "408",
  "Conflict": "409",
  "Gone": "410",
  "Length Required": "411",
  "Precondition Failed": "412",
  "Request Entity Too Large": "413",
  "Request-URI Too Long": "414",
  "Unsupported Media Type": "415",
  "Requested Range Not Satisfiable": "416",
  "Expectation Failed": "417",
  "I'm a teapot": "418",
  "Insufficient Space on Resource": "419",
  "Method Failure": "420",
  "Misdirected Request": "421",
  "Unprocessable Entity": "422",
  "Locked": "423",
  "Failed Dependency": "424",
  "Upgrade Required": "426",
  "Precondition Required": "428",
  "Too Many Requests": "429",
  "Request Header Fields Too Large": "431",
  "Unavailable For Legal Reasons": "451",

  "Internal Server Error": "500",
  "Not Implemented": "501",
  "Bad Gateway": "502",
  "Service Unavailable": "503",
  "Gateway Timeout": "504",
  "HTTP Version Not Supported": "505",
  "Insufficient Storage": "507",
  "Network Authentication Required": "511",
}

export { type API, ApiResponse, STATUS_CODES, STATUS_TEXTS, STATUS_CODE_TO_TEXT, STATUS_TEXT_TO_CODE }
