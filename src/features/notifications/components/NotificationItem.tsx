import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, X } from "lucide-react";
import type { Notification } from "../api/notificationsApi";
import { cn } from "@/lib/utils";

function notificationIcon(type: string) {
  switch (type) {
    case "task_assigned":
      return "✅";
    case "leave_request":
      return "📋";
    case "leave_approved":
      return "🎉";
    case "leave_rejected":
      return "❌";
    case "onboarding_task_completed":
      return "🚀";
    default:
      return "🔔";
  }
}

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40",
        !notification.is_read && "bg-primary/5"
      )}
    >
      <span className="mt-0.5 text-lg leading-none" aria-hidden="true">
        {notificationIcon(notification.type)}
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm leading-snug", !notification.is_read && "font-medium")}>
          {notification.title}
        </p>
        {notification.message && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
      {!notification.is_read && (
        <button
          aria-label="Mark as read"
          onClick={() => onMarkRead(notification.id)}
          className="mt-0.5 shrink-0 rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {notification.is_read && (
        <CheckCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
      )}
    </div>
  );
}

export { Bell };
