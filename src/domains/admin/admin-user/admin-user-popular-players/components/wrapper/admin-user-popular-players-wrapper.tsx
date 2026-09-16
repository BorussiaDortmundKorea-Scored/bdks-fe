/**
 * 작성자: KYD
 * 기능: 인기 최애선수 순위 공통 레이아웃 쉘 (본체/스켈레톤/에러 공용)
 * 프로세스 설명: 제목 영역은 쉘이 갖고, 우측 요약(summary)과 본문만 주입받는다.
 *              사용자 관리 섹션과 동일한 헤더(text-yds-s1 + p-4)를 써서 위아래 위계를 맞춘다
 */
import React from "react";

interface IAdminUserPopularPlayersWrapper {
  children: React.ReactNode;
  /** 제목 우측 요약 영역 (총 등록자 수 등) */
  summary?: React.ReactNode;
}

const AdminUserPopularPlayersWrapper = ({ children, summary }: IAdminUserPopularPlayersWrapper) => {
  return (
    <section className="flex h-full w-full flex-col">
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">인기 최애선수</h2>
        {summary}
      </div>
      <div className="w-full px-4">{children}</div>
    </section>
  );
};

export default AdminUserPopularPlayersWrapper;
