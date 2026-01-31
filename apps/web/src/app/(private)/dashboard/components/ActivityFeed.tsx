import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  MessageSquare,
  Video,
} from "lucide-react";
import type { RecentActivity } from "../types";

interface ActivityFeedProps {
  activities: RecentActivity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "content":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "revenue":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "task":
        return <CheckCircle className="h-4 w-4 text-amber-500" />;
      case "system":
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUserInitials = (user: string) => {
    return user
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="divide-y divide-border">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getUserInitials(activity.user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm">
              <span className="font-semibold text-foreground">
                {activity.user}
              </span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium text-foreground">
                {activity.target}
              </span>
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{activity.timestamp}</span>
              <div className="ml-auto">{getActivityIcon(activity.type)}</div>
            </div>
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4"
      >
        <button className="w-full text-center py-2 text-sm text-primary hover:text-primary/80 font-medium">
          Ver todas as atividades →
        </button>
      </motion.div>
    </div>
  );
}
