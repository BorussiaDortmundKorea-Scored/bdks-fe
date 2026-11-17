-- 관리자 팀 관리 화면의 "국가별 팀 수" 차트용 집계 RPC.
-- 국가가 없는 팀은 country_id = null, country_name = '국가 미지정' 한 줄로 묶는다.
-- 팀 수 많은 순 → 국가명 순으로 정렬해서 내려준다 (FE 는 받은 순서 그대로 그린다).
create or replace function public.get_team_count_by_country()
returns table(country_id uuid, country_name text, team_count integer)
language plpgsql stable security definer
set search_path = public
as $$
begin
  if not exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin is true) then
    raise exception using
      errcode = 'PT403',
      message = 'FORBIDDEN_ADMIN_ONLY',
      detail  = 'get_team_count_by_country: 관리자만 조회할 수 있습니다.';
  end if;

  return query
  select
    c.id,
    coalesce(c.name::text, '국가 미지정'),
    count(t.id)::integer
  from teams t
  left join countries c on c.id = t.country_id
  group by c.id, c.name
  order by count(t.id) desc, coalesce(c.name::text, '국가 미지정');
end;
$$;

revoke all on function public.get_team_count_by_country() from public, anon;
grant execute on function public.get_team_count_by_country() to authenticated;
