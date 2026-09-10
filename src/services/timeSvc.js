import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * 날짜 및 시간을 상대적 시간 형식으로 포맷팅하는 서비스 모듈.
 */
export default {
  /**
   * 지정된 타임스탬프 또는 날짜 객체를 상대 시간 문자열로 변환함.
   *
   * @param {number|string|Date} time - 변환할 대상 시간.
   * @returns {string|null} 상대 시간 문자열 (예: '5 minutes ago') 또는 유효하지 않은 경우 null.
   */
  format(time) {
    if (!time) {
      return null;
    }
    const d = dayjs(time);
    if (!d.isValid()) {
      return null;
    }
    return d.fromNow();
  },
};
