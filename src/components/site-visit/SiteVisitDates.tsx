
import { Calendar } from "lucide-react";
import { SiteVisit } from "@/types";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

interface SiteVisitDatesProps {
  siteVisit: SiteVisit;
}

export const SiteVisitDates = ({ siteVisit }: SiteVisitDatesProps) => {
  return (
    <Card className="p-6 mt-6 hover:shadow-lg transition-shadow border-none bg-gradient-to-br from-primary/5 via-primary/10 to-background">
      <h3 className="text-lg font-semibold mb-4 text-primary">Important Dates</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3 p-3 rounded-md bg-white/50 hover:bg-white/80 transition-colors">
          <Calendar className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Visit Date</p>
            <p className="font-semibold">
              {siteVisit.scheduledDate 
                ? format(new Date(siteVisit.scheduledDate), 'MMM d, yyyy')
                : 'Not scheduled'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-md bg-white/50 hover:bg-white/80 transition-colors">
          <Calendar className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Distribution Date</p>
            <p className="font-semibold">
              {siteVisit.scheduledDate
                ? format(new Date(siteVisit.scheduledDate), 'MMM d, yyyy')
                : 'Not scheduled'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-md bg-white/50 hover:bg-white/80 transition-colors">
          <Calendar className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Due Date</p>
            <p className="font-semibold">
              {format(new Date(siteVisit.dueDate || new Date()), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
