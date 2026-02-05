import { Progress } from "@/components/ui/progress";
import { ContentPlatform } from "@/shared/enums";
import { motion } from "framer-motion";
import {
  Facebook,
  Globe,
  Instagram,
  Music,
  Twitch,
  Youtube,
} from "lucide-react";
import { useTheme } from "next-themes";

interface PlatformDistributionProps {
  data: Array<{
    platform: ContentPlatform;
    amount: number;
    percentage: number;
    growth: number;
  }>;
  platformColors: Record<ContentPlatform, string>;
  timeRange: "week" | "month" | "quarter";
}

export default function PlatformDistribution({
  data,
  platformColors,
  timeRange,
}: PlatformDistributionProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getPlatformIcon = (platform: ContentPlatform) => {
    switch (platform) {
      case ContentPlatform.YOUTUBE:
        return <Youtube size={16} />;
      case ContentPlatform.TIKTOK:
        return <Music size={16} />;
      case ContentPlatform.INSTAGRAM:
        return <Instagram size={16} />;
      case ContentPlatform.TWITCH:
        return <Twitch size={16} />;
      case ContentPlatform.FACEBOOK:
        return <Facebook size={16} />;
      default:
        return <Globe size={16} />;
    }
  };

  const getPlatformName = (platform: ContentPlatform) => {
    switch (platform) {
      case ContentPlatform.YOUTUBE:
        return "YouTube";
      case ContentPlatform.TIKTOK:
        return "TikTok";
      case ContentPlatform.INSTAGRAM:
        return "Instagram";
      case ContentPlatform.TWITCH:
        return "Twitch";
      case ContentPlatform.FACEBOOK:
        return "Facebook";
      default:
        return "Outros";
    }
  };

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <motion.div
          key={item.platform}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${platformColors[item.platform]}${isDark ? "30" : "15"}`,
                  color: platformColors[item.platform],
                }}
              >
                <span className="text-sm">
                  {getPlatformIcon(item.platform)}
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">
                  {getPlatformName(item.platform)}
                </span>
                <p className="text-xs text-muted-foreground">
                  {item.percentage}% da receita
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">
                R${" "}
                {item.amount.toLocaleString("pt-BR", {
                  minimumFractionDigits: 0,
                })}
              </p>
              <p
                className={`text-xs ${item.growth >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {item.growth >= 0 ? "+" : ""}
                {item.growth}%
              </p>
            </div>
          </div>
          <Progress
            value={item.percentage}
            className="h-2"
            style={{
              backgroundColor: `${platformColors[item.platform]}${isDark ? "20" : "10"}`,
            }}
          />
        </motion.div>
      ))}
      <div className="pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Total em{" "}
            {timeRange === "week"
              ? "semana"
              : timeRange === "month"
                ? "mês"
                : "trimestre"}
          </span>
          <span className="font-semibold text-foreground">
            R${" "}
            {data
              .reduce((sum, item) => sum + item.amount, 0)
              .toLocaleString("pt-BR")}
          </span>
        </div>
      </div>
    </div>
  );
}
