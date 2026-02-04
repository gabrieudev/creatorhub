import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
  iconColor: string;
  iconBgColor: string;
  delay: number;
}

export default function StatCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  iconColor,
  iconBgColor,
  delay,
}: StatCardProps) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <Card className="border hover:shadow-md transition-all h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg ${iconBgColor} ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge
              variant="outline"
              className={`${isPositive ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"}`}
            >
              {change}
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
          <p className="text-muted-foreground text-sm">{title}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
