import { Badge } from "@/components/ui/badge";
import { type ProductActivation } from "@/lib/pricing/types";

interface StatusBadgeProps {
  status: ProductActivation['status'];
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    inactive: {
      variant: "secondary" as const,
      text: "Inactive",
      className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    },
    provisioning: {
      variant: "default" as const,
      text: "Provisioning",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    },
    active: {
      variant: "default" as const,
      text: "Live",
      className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    }
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className || ''}`}
      data-testid={`status-badge-${status}`}
    >
      {config.text}
    </Badge>
  );
}