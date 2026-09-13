-- ============================================================
-- 0014: Notification Triggers (HR Tasks)
-- ============================================================

create or replace function notify_hr_task_assignment()
returns trigger as $$
begin
  -- Only notify if there's an assignee and it's a new task OR the assignee changed
  if new.assignee_id is not null and (TG_OP = 'INSERT' or old.assignee_id is distinct from new.assignee_id) then
    insert into public.notifications (
      recipient_id, 
      type, 
      title, 
      message, 
      related_entity_type, 
      related_entity_id
    )
    values (
      new.assignee_id,
      'task_assigned',
      'New Task Assigned',
      'You have been assigned to a task: ' || new.title,
      'hr_task',
      new.id
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists hr_task_assignment_trigger on public.hr_tasks;
create trigger hr_task_assignment_trigger
  after insert or update on public.hr_tasks
  for each row execute function notify_hr_task_assignment();
