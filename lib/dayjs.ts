import dayjs, { extend } from 'dayjs'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import 'dayjs/locale/ko'

extend(utc)
extend(timezone)
extend(localizedFormat)

dayjs.tz.setDefault('Asia/Seoul')

export default dayjs.tz
