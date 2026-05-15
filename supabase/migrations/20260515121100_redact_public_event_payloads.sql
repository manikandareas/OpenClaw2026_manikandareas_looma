-- Public beta policy: the exposed public.events table stores replay-safe payloads only.
-- Raw tool payloads are intentionally discarded before they can appear through
-- RLS-backed reads or Supabase Realtime publications.

update public.events
set payload_json = redacted_payload_json
where payload_json is distinct from redacted_payload_json;

create or replace function public.force_redacted_event_payload()
returns trigger
language plpgsql
as $$
begin
  new.payload_json := coalesce(new.redacted_payload_json, '{}'::jsonb);
  return new;
end;
$$;

drop trigger if exists force_redacted_event_payload on public.events;

create trigger force_redacted_event_payload
before insert or update of payload_json, redacted_payload_json on public.events
for each row
execute function public.force_redacted_event_payload();
