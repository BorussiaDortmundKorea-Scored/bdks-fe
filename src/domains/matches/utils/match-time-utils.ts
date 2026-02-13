//SECTION : 아래 메서드에 사용할 상수 영역
export const MATCH_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  FIRST_HALF: "FIRST_HALF",
  HALF_TIME: "HALF_TIME",
  SECOND_HALF: "SECOND_HALF",
  FULL_TIME: "FULL_TIME",
} as const;

export const MATCH_DISPLAY_TEXT = {
  NOT_STARTED: "경기 전",
  HALF_TIME: "전반 종료",
  FULL_TIME: "경기 종료",
} as const;

export type MatchStatus = (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];
//!SECTION : 아래 메서드에 사용할 상수 영역

export const getMatchStatus = (
  matchStartTime: Date,
  firstHalfEndTime: Date,
  secondHalfStartTime: Date,
  secondHalfEndTime: Date,
  nowTime: Date,
): MatchStatus => {
  const now = nowTime;

  if (now < matchStartTime) return MATCH_STATUS.NOT_STARTED;
  if (now >= secondHalfEndTime) return MATCH_STATUS.FULL_TIME;

  // 휴식시간 계산 (전반 종료 ~ 후반 시작)
  const halfTimeEndTime = secondHalfStartTime;

  if (now <= firstHalfEndTime) return MATCH_STATUS.FIRST_HALF;
  if (now < halfTimeEndTime) return MATCH_STATUS.HALF_TIME;
  return MATCH_STATUS.SECOND_HALF;
};

export const getCurrentMatchTime = (
  matchStartTime: Date,
  firstHalfEndTime: Date,
  secondHalfStartTime: Date,
  secondHalfEndTime: Date,
  nowTime: Date,
): number => {
  const now = nowTime;
  const status = getMatchStatus(matchStartTime, firstHalfEndTime, secondHalfStartTime, secondHalfEndTime, now);

  switch (status) {
    case MATCH_STATUS.FIRST_HALF: {
      const minutes = Math.floor((now.getTime() - matchStartTime.getTime()) / (60 * 1000));
      return minutes;
    }
    case MATCH_STATUS.SECOND_HALF: {
      const minutes = Math.floor((now.getTime() - secondHalfStartTime.getTime()) / (60 * 1000));
      return minutes;
    }
    case MATCH_STATUS.HALF_TIME:
      return Math.floor((firstHalfEndTime.getTime() - matchStartTime.getTime()) / (60 * 1000));
    case MATCH_STATUS.FULL_TIME:
      return Math.floor((secondHalfEndTime.getTime() - secondHalfStartTime.getTime()) / (60 * 1000));
    default:
      return 0;
  }
};

export const getDisplayTime = (
  matchStartTime: Date,
  firstHalfEndTime: Date,
  secondHalfStartTime: Date,
  secondHalfEndTime: Date,
  nowTime: Date,
): string => {
  const now = nowTime;
  const status = getMatchStatus(matchStartTime, firstHalfEndTime, secondHalfStartTime, secondHalfEndTime, now);

  if (status === MATCH_STATUS.NOT_STARTED) return MATCH_DISPLAY_TEXT.NOT_STARTED;
  if (status === MATCH_STATUS.FULL_TIME) return MATCH_DISPLAY_TEXT.FULL_TIME;
  if (status === MATCH_STATUS.HALF_TIME) return MATCH_DISPLAY_TEXT.HALF_TIME;

  const currentTime = getCurrentMatchTime(
    matchStartTime,
    firstHalfEndTime,
    secondHalfStartTime,
    secondHalfEndTime,
    now,
  );

  // 초 계산
  let seconds = 0;
  if (status === MATCH_STATUS.FIRST_HALF) {
    const totalSeconds = Math.floor((now.getTime() - matchStartTime.getTime()) / 1000);
    seconds = totalSeconds % 60;
  } else if (status === MATCH_STATUS.SECOND_HALF) {
    const totalSeconds = Math.floor((now.getTime() - secondHalfStartTime.getTime()) / 1000);
    seconds = totalSeconds % 60;
  }

  const secondsText = seconds.toString().padStart(2, "0");

  // 45분 넘어가면 추가시간 표시
  if (currentTime > 45) {
    const extraTime = currentTime - 45;
    return status === MATCH_STATUS.FIRST_HALF
      ? `전반 ${45}+${extraTime}분 ${secondsText}초`
      : `후반 ${45}+${extraTime}분 ${secondsText}초`;
  }

  return status === MATCH_STATUS.FIRST_HALF
    ? `전반 ${currentTime}분 ${secondsText}초`
    : `후반 ${currentTime}분 ${secondsText}초`;
};

export const isMatchLive = (status: MatchStatus): boolean => {
  return status === MATCH_STATUS.FIRST_HALF || status === MATCH_STATUS.SECOND_HALF;
};

/**
 * 경기 시간 표시 문자열에서 초를 제거하고 분만 반환
 * "전반 30분 45초" -> "전반 30'"
 * "전반 45+3분 45초" -> "전반 45+3'"
 * "후반 12분 30초" -> "후반 12'"
 */
export const parseMinuteFromDisplayTime = (displayTime: string): string => {
  // 경기 전, 전반 종료, 경기 종료는 그대로 반환
  if (
    displayTime === MATCH_DISPLAY_TEXT.NOT_STARTED ||
    displayTime === MATCH_DISPLAY_TEXT.HALF_TIME ||
    displayTime === MATCH_DISPLAY_TEXT.FULL_TIME
  ) {
    return displayTime;
  }

  // "전반 30분 45초" 또는 "후반 12분 30초" 형식에서 초 제거
  // "전반 45+3분 45초" 또는 "후반 45+5분 30초" 형식도 처리
  const minutePattern = /^(전반|후반)\s+(\d+)(?:\+(\d+))?분\s+\d+초$/;
  const match = displayTime.match(minutePattern);

  if (match) {
    const half = match[1]; // "전반" 또는 "후반"
    const baseMinute = match[2]; // 기본 분
    const extraMinute = match[3]; // 추가 시간 (있을 경우)

    if (extraMinute) {
      return `${half} ${baseMinute}+${extraMinute}'`;
    }
    return `${half} ${baseMinute}'`;
  }

  // 패턴이 맞지 않으면 원본 반환 (안전장치)
  return displayTime;
};
