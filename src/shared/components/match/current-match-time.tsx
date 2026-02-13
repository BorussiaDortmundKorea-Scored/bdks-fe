/**
 * 작성자: KYD
 * 기능: 경기 현재 시간 표시 컴포넌트 (1초마다 자동 갱신)
 * 프로세스 설명: 경기 시작/종료 시간을 기반으로 현재 경기 시간을 1초마다 갱신하여 표시
 */
import { useEffect, useState } from "react";

import { getDisplayTime } from "@matches/utils/match-time-utils";

interface CurrentMatchTimeProps {
  match_start_time: Date | string;
  first_half_end_time: Date | string;
  second_half_start_time: Date | string;
  second_half_end_time: Date | string;
  className?: string;
}

const CurrentMatchTime = ({
  match_start_time,
  first_half_end_time,
  second_half_start_time,
  second_half_end_time,
  className,
}: CurrentMatchTimeProps) => {
  //SECTION HOOK호출 영역
  const [currentTime, setCurrentTime] = useState<string>("");
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  useEffect(() => {
    const updateTime = () => {
      const time = getDisplayTime(
        match_start_time instanceof Date ? match_start_time : new Date(match_start_time),
        first_half_end_time instanceof Date ? first_half_end_time : new Date(first_half_end_time),
        second_half_start_time instanceof Date ? second_half_start_time : new Date(second_half_start_time),
        second_half_end_time instanceof Date ? second_half_end_time : new Date(second_half_end_time),
        new Date(),
      );
      setCurrentTime(time);
    };

    // 즉시 한 번 실행
    updateTime();

    // 1초마다 갱신
    const intervalId = setInterval(updateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [match_start_time, first_half_end_time, second_half_start_time, second_half_end_time]);
  //!SECTION 메서드 영역

  return <div className={className}>{currentTime}</div>;
};

export default CurrentMatchTime;
