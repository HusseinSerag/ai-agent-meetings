import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheckIcon } from "lucide-react";

const pricingCardVariant = cva("rounded-lg p-4 py-6 w-full", {
  variants: {
    variant: {
      default: "bg-white text-black",
      highlighted: "bg-linear-to-br from-[#093c23] to-[#051b16] text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const pricingCardIconVariant = cva("size-5", {
  variants: {
    variant: {
      default: "fill-primary text-white",
      highlighted: "fill-white text-black",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const pricingCardSecondaryTextVariant = cva("text-neutral-700", {
  variants: {
    variant: {
      default: "text-neutral-700",
      highlighted: "text-neutral-300",
    },
  },
});

const pricingCardBadgeVariant = cva("text-black text-xs font-normal p-1", {
  variants: {
    variant: {
      default: "bg-primary/20",
      highlighted: "bg-[#f5b797]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface Props extends VariantProps<typeof pricingCardVariant> {
  badge?: string | null;
  price: number;
  features: string[];
  title: string;
  description?: string | null;
  priceSuffix: string;
  className?: string;
  buttonText: string;
  onClick(): void;
}

export function PricingCard({
  buttonText,
  features,
  onClick,
  price,
  priceSuffix,
  title,
  badge,
  className,
  description,
  variant,
}: Props) {
  return (
    <div
      className={cn(
        pricingCardVariant({ variant }),
        className,
        "border max-w-[300px]"
      )}
    >
      <div className="flex items-center gap-x-4 justify-between">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <h6 className="font-medium text-xl">{title}</h6>
            {badge && (
              <Badge className={cn(pricingCardBadgeVariant({ variant }))}>
                {badge}
              </Badge>
            )}
          </div>
          <p
            className={cn(
              "text-xs",
              pricingCardSecondaryTextVariant({ variant })
            )}
          >
            {description}
          </p>
        </div>
        <div className="flex items-end shrink-0 gap-x-0.5">
          <h4 className="text-3xl font-medium">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(price)}
          </h4>
          <span className={cn(pricingCardSecondaryTextVariant({ variant }))}>
            {priceSuffix}
          </span>
        </div>
      </div>
      <div className="py-6">
        <Separator className="opacity-10 text-[#5d6b68]" />
      </div>
      <Button
        onClick={onClick}
        className="w-full"
        size="lg"
        variant={variant === "highlighted" ? "default" : "outline"}
      >
        {buttonText}
      </Button>
      <div className="flex flex-col gap-y-2 mt-6">
        <p className="font-medium uppercase">Features</p>
        <ul
          className={cn(
            "flex flex-col gap-y-2.5",
            pricingCardSecondaryTextVariant({ variant })
          )}
        >
          {features.map((feature, i) => (
            <li className="flex items-center gap-x-2.5" key={i}>
              <CircleCheckIcon
                className={cn(pricingCardIconVariant({ variant }))}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
