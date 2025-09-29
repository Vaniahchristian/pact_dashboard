
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ClipboardList, 
  FileCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  title: string;
  description: string;
  type: "approval" | "upload" | "visit" | "reminder" | "alert";
  timestamp: string;
  status?: "pending" | "completed" | "critical";
  user?: string;
}

interface ActivityFeedProps {
  className?: string;
}

const ActivityFeed = ({ className }: ActivityFeedProps) => {
  // Sample activities data
  const activities: Activity[] = [
    {
      id: "act1",
      title: "MMP-2023-045 Approval",
      description: "MMP approval request is waiting for your review",
      type: "approval",
      timestamp: "10 mins ago",
      status: "pending",
      user: "Mohammed Ali"
    },
    {
      id: "act2",
      title: "Field Team Site Visit",
      description: "Team completed the site visit at Al Fashir",
      type: "visit",
      timestamp: "1 hour ago",
      status: "completed",
      user: "Sara Ahmed"
    },
    {
      id: "act3",
      title: "MMP Upload Verification",
      description: "MMP-2023-030 has been verified and approved",
      type: "upload",
      timestamp: "2 hours ago",
      status: "completed"
    },
    {
      id: "act4",
      title: "Upcoming Site Visit",
      description: "Scheduled for tomorrow at South Darfur",
      type: "reminder",
      timestamp: "3 hours ago"
    },
    {
      id: "act5",
      title: "Data Validation Alert",
      description: "Critical: MMP-2023-050 requires immediate attention",
      type: "alert",
      timestamp: "5 hours ago",
      status: "critical"
    }
  ];

  const getActivityIcon = (type: Activity["type"], status?: Activity["status"]) => {
    switch (type) {
      case "approval":
        return <FileCheck className="h-5 w-5 text-blue-500" />;
      case "upload":
        return <ClipboardList className="h-5 w-5 text-purple-500" />;
      case "visit":
        return <MapPin className="h-5 w-5 text-green-500" />;
      case "reminder":
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: Activity["status"]) => {
    if (!status) return null;
    
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case "critical":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 animate-pulse">Critical</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={cn("border-t-4 border-t-blue-500 overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="bg-slate-50 pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5 text-primary" />
            Activity Feed
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[350px]">
          <div className="p-4 space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex gap-3 group hover:bg-slate-50 p-2 rounded-md transition-colors"
              >
                <div className="mt-0.5">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{activity.timestamp}</span>
                    {activity.user && (
                      <>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
