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
      status: ok ? '성공' : '실패',
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
  CONTINUE: "계속",
  SWITCHING_PROTOCOLS: "프로토콜 전환",
  PROCESSING: "처리 중",
  EARLY_HINTS: "초기 힌트",

  OK: "성공",
  CREATED: "생성됨",
  ACCEPTED: "허용됨",
  NON_AUTHORITATIVE_INFORMATION: "신뢰할 수 없는 정보",
  NO_CONTENT: "콘텐츠 없음",
  RESET_CONTENT: "콘텐츠 재설정",
  PARTIAL_CONTENT: "일부 콘텐츠",
  MULTI_STATUS: "다중 상태",

  MULTIPLE_CHOICES: "복수 응답",
  MOVED_PERMANENTLY: "영구 이동",
  MOVED_TEMPORARILY: "임시 이동",
  SEE_OTHER: "기타 위치 보기",
  NOT_MODIFIED: "수정되지 않음",
  USE_PROXY: "프록시 사용",
  TEMPORARY_REDIRECT: "임시 리다이렉션",
  PERMANENT_REDIRECT: "영구 리다이렉션",

  BAD_REQUEST: "잘못된 요청",
  UNAUTHORIZED: "권한 없음",
  PAYMENT_REQUIRED: "결제 필요",
  FORBIDDEN: "거부됨",
  NOT_FOUND: "찾을 수 없음",
  METHOD_NOT_ALLOWED: "허용되지 않는 메소드",
  NOT_ACCEPTABLE: "받아들일 수 없음",
  PROXY_AUTHENTICATION_REQUIRED: "프록시 인증 필요",
  REQUEST_TIMEOUT: "요청 시간 초과",
  CONFLICT: "충돌",
  GONE: "사라짐",
  LENGTH_REQUIRED: "길이 필요",
  PRECONDITION_FAILED: "전제조건 실패",
  REQUEST_TOO_LONG: "요청이 너무 긺",
  REQUEST_URI_TOO_LONG: "URI가 너무 긺",
  UNSUPPORTED_MEDIA_TYPE: "지원하지 않는 미디어 타입",
  REQUESTED_RANGE_NOT_SATISFIABLE: "요청범위 부적합",
  EXPECTATION_FAILED: "예측 실패",
  IM_A_TEAPOT: "I'm a teapot",
  INSUFFICIENT_SPACE_ON_RESOURCE: "리소스 공간 부족",
  METHOD_FAILURE: "메서드 실패",
  MISDIRECTED_REQUEST: "잘못된 요청",
  UNPROCESSABLE_ENTITY: "처리할 수 없는 개체",
  LOCKED: "잠김",
  FAILED_DEPENDENCY: "실패한 종속성",
  UPGRADE_REQUIRED: "업그레이드 필요",
  PRECONDITION_REQUIRED: "전제조건 필요",
  TOO_MANY_REQUESTS: "너무 많은 요청",
  REQUEST_HEADER_FIELDS_TOO_LARGE: "요청 헤더 필드가 너무 큼",
  UNAVAILABLE_FOR_LEGAL_REASONS: "법적인 이유로 차단됨",

  INTERNAL_SERVER_ERROR: "내부 서버 오류",
  NOT_IMPLEMENTED: "요청한 기능 미지원",
  BAD_GATEWAY: "게이트웨이 불량",
  SERVICE_UNAVAILABLE: "서비스를 사용할 수 없음",
  GATEWAY_TIMEOUT: "게이트웨이 시간 초과",
  HTTP_VERSION_NOT_SUPPORTED: "지원되지 않는 HTTP 버전",
  INSUFFICIENT_STORAGE: "저장 공간 부족",
  NETWORK_AUTHENTICATION_REQUIRED: "네트워크 인증 필요",
}

// prettier-ignore
const STATUS_CODE_TO_TEXT: Record<string, string> = {
  "100": "계속",
  "101": "프로토콜 전환",
  "102": "처리 중",
  "103": "초기 힌트",

  "200": "성공",
  "201": "생성됨",
  "202": "허용됨",
  "203": "신뢰할 수 없는 정보",
  "204": "콘텐츠 없음",
  "205": "콘텐츠 재설정",
  "206": "일부 콘텐츠",
  "207": "다중 상태",

  "300": "복수 응답",
  "301": "영구 이동",
  "302": "임시 이동",
  "303": "기타 위치 보기",
  "304": "수정되지 않음",
  "305": "프록시 사용",
  "307": "임시 리다이렉션",
  "308": "영구 리다이렉션",

  "400": "잘못된 요청",
  "401": "권한 없음",
  "402": "결제 필요",
  "403": "거부됨",
  "404": "찾을 수 없음",
  "405": "허용되지 않는 메소드",
  "406": "받아들일 수 없음",
  "407": "프록시 인증 필요",
  "408": "요청 시간 초과",
  "409": "충돌",
  "410": "사라짐",
  "411": "길이 필요",
  "412": "전제조건 실패",
  "413": "요청이 너무 긺",
  "414": "URI가 너무 긺",
  "415": "지원하지 않는 미디어 타입",
  "416": "요청범위 부적합",
  "417": "예측 실패",
  "418": "I'm a teapot",
  "419": "리소스 공간 부족",
  "420": "메서드 실패",
  "421": "잘못된 요청",
  "422": "처리할 수 없는 개체",
  "423": "잠김",
  "424": "실패한 종속성",
  "426": "업그레이드 필요",
  "428": "전제조건 필요",
  "429": "너무 많은 요청",
  "431": "요청 헤더 필드가 너무 큼",
  "451": "법적인 이유로 차단됨",

  "500": "내부 서버 오류",
  "501": "요청한 기능 미지원",
  "502": "게이트웨이 불량",
  "503": "서비스를 사용할 수 없음",
  "504": "게이트웨이 시간 초과",
  "505": "지원되지 않는 HTTP 버전",
  "507": "저장 공간 부족",
  "511": "네트워크 인증 필요",
}

// prettier-ignore
const STATUS_TEXT_TO_CODE: Record<string, string> = {
  "계속": "100",
  "프로토콜 전환": "101",
  "처리 중": "102",
  "초기 힌트": "103",

  "성공": "200",
  "생성됨": "201",
  "허용됨": "202",
  "신뢰할 수 없는 정보": "203",
  "콘텐츠 없음": "204",
  "콘텐츠 재설정": "205",
  "일부 콘텐츠": "206",
  "다중 상태": "207",

  "복수 응답": "300",
  "영구 이동": "301",
  "임시 이동": "302",
  "기타 위치 보기": "303",
  "수정되지 않음": "304",
  "프록시 사용": "305",
  "임시 리다이렉션": "307",
  "영구 리다이렉션": "308",

  "잘못된 요청": "400",
  "권한 없음": "401",
  "결제 필요": "402",
  "거부됨": "403",
  "찾을 수 없음": "404",
  "허용되지 않는 메소드": "405",
  "받아들일 수 없음": "406",
  "프록시 인증 필요": "407",
  "요청 시간 초과": "408",
  "충돌": "409",
  "사라짐": "410",
  "길이 필요": "411",
  "전제조건 실패": "412",
  "요청이 너무 긺": "413",
  "URI가 너무 긺": "414",
  "지원하지 않는 미디어 타입": "415",
  "요청범위 부적합": "416",
  "예측 실패": "417",
  "I'm a teapot": "418",
  "리소스 공간 부족": "419",
  "메서드 실패": "420",
  "잘못된 방향 요청": "421",
  "처리할 수 없는 개체": "422",
  "잠김": "423",
  "실패한 종속성": "424",
  "업그레이드 필요": "426",
  "전제조건 필요": "428",
  "너무 많은 요청": "429",
  "요청 헤더 필드가 너무 큼": "431",
  "법적인 이유로 차단됨": "451",

  "내부 서버 오류": "500",
  "요청한 기능 미지원": "501",
  "게이트웨이 불량": "502",
  "서비스를 사용할 수 없음": "503",
  "게이트웨이 시간 초과": "504",
  "지원되지 않는 HTTP 버전": "505",
  "저장 공간 부족": "507",
  "네트워크 인증 필요": "511",
}

// export { type API, ApiResponse, STATUS_CODES, STATUS_TEXTS, STATUS_CODE_TO_TEXT, STATUS_TEXT_TO_CODE }
