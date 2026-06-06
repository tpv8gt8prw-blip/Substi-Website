import Image from "next/image";
import { cn } from "@/lib/utils";

const ICON_SRC = "/substi-icon.png";

type SubstiLogoProps = {
  size?: number;
  className?: string;
  imageClassName?: string;
  showLabel?: boolean;
  labelClassName?: string;
  priority?: boolean;
};

export function SubstiLogo({
  size = 36,
  className,
  imageClassName,
  showLabel = false,
  labelClassName,
  priority = false,
}: SubstiLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={ICON_SRC}
        alt="Substi"
        width={size}
        height={size}
        priority={priority}
        className={cn("shrink-0 rounded-[22%] object-cover", imageClassName)}
      />
      {showLabel && (
        <span
          className={cn(
            "font-display text-lg font-extrabold tracking-tight",
            labelClassName
          )}
        >
          Substi
        </span>
      )}
    </span>
  );
}

export { ICON_SRC as SUBSTI_ICON_SRC };
