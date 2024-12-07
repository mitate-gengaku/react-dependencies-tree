import { LoaderCircleIcon } from "lucide-react";

import { cn } from "@/utils/cn";

interface Props {
  className?: string;
}
export const Spinner = (props: Props) => (
  <LoaderCircleIcon
    className={cn("animate-spin text-green-500", props.className)}
    data-testid="spinner"
  />
);
