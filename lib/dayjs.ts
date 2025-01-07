import dayjs, { extend } from 'dayjs'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import 'dayjs/locale/ko'
import 'dayjs/locale/ja'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import 'dayjs/locale/zh-hk'
import 'dayjs/locale/zh'

extend(utc)
extend(timezone)
extend(localizedFormat)

const timestamp = Date.now()
const tz = 'Asia/Seoul'

dayjs.tz.setDefault(tz)

export default dayjs
