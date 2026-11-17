-- Applied to both dev (cbslhrnoayazuoyukqxg) and prod (2026-11-17, migration name: admin_player_status).
-- Keep the existing public/lineup get_all_players contract unchanged.
create or replace function public.get_admin_players()
returns jsonb
language plpgsql stable security definer
set search_path = public
as $$
begin
  perform public.assert_admin();
  return coalesce((
    select jsonb_agg(row_data order by row_data->>'name')
    from (
      select to_jsonb(p) || jsonb_build_object(
        'status', case
          when latest.transfer_type = 'RETIRED' then 'RETIRED'
          when latest.direction = 'IN' then 'ACTIVE'
          when latest.direction = 'OUT' then 'TRANSFERRED'
          when p.is_current_squad is true then 'ACTIVE'
          else 'TRANSFERRED'
        end
      ) as row_data
      from public.players p
      left join lateral (
        select tr.direction, tr.transfer_type
        from public.transfers tr
        where tr.player_id = p.id
        order by coalesce(tr.transfer_date, (tr.created_at at time zone 'Asia/Seoul')::date) desc,
          tr.created_at desc, tr.id desc
        limit 1
      ) latest on true
    ) rows
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.get_admin_players() from public, anon;
grant execute on function public.get_admin_players() to authenticated;

create or replace function public.insert_transfer(
  p_player_id uuid, p_direction varchar,
  p_transfer_type varchar default 'PERMANENT',
  p_counterpart_team_id uuid default null,
  p_transfer_date date default null, p_euro_fee bigint default null
)
returns public.transfers
language plpgsql security definer
set search_path = public
as $$
declare new_row public.transfers%rowtype;
begin
  perform public.assert_admin();
  -- Serialize changes to the same player and keep historical entries from
  -- overriding the squad state established by a more recent transfer.
  perform 1 from public.players where id = p_player_id for update;
  if not found then
    raise exception '선수를 찾을 수 없습니다.';
  end if;
  insert into public.transfers
    (player_id, direction, transfer_type, counterpart_team_id, transfer_date, euro_fee)
  values (
    p_player_id, p_direction, p_transfer_type,
    case when p_transfer_type = 'RETIRED' then null else p_counterpart_team_id end,
    p_transfer_date,
    case when p_transfer_type = 'RETIRED' then null else p_euro_fee end
  ) returning * into new_row;

  update public.players set
    is_current_squad = (
      select tr.direction = 'IN' from public.transfers tr
      where tr.player_id = p_player_id
      order by coalesce(tr.transfer_date, (tr.created_at at time zone 'Asia/Seoul')::date) desc,
        tr.created_at desc, tr.id desc limit 1
    ),
    updated_at = now()
  where id = p_player_id;
  return new_row;
end;
$$;
