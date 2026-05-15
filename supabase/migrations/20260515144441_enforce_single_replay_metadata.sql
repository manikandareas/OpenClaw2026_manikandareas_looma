with ranked as (
  select
    ctid,
    row_number() over (partition by session_id order by created_at desc, id desc) as rank
  from public.session_notes
)
delete from public.session_notes
using ranked
where public.session_notes.ctid = ranked.ctid
  and ranked.rank > 1;

with ranked as (
  select
    ctid,
    row_number() over (partition by session_id order by created_at desc, id desc) as rank
  from public.behavior_summary
)
delete from public.behavior_summary
using ranked
where public.behavior_summary.ctid = ranked.ctid
  and ranked.rank > 1;

with ranked as (
  select
    ctid,
    row_number() over (partition by session_id order by created_at desc, id desc) as rank
  from public.replay_metadata
)
delete from public.replay_metadata
using ranked
where public.replay_metadata.ctid = ranked.ctid
  and ranked.rank > 1;

create unique index if not exists session_notes_session_id_key
  on public.session_notes(session_id);

create unique index if not exists behavior_summary_session_id_key
  on public.behavior_summary(session_id);

create unique index if not exists replay_metadata_session_id_key
  on public.replay_metadata(session_id);
