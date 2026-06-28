import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-dominia-border focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "border-transparent bg-dominia-gold text-dominia-brown",
				secondary: "border-transparent bg-dominia-cream text-dominia-charcoal",
				outline: "text-dominia-charcoal border-dominia-sand",
				accent: "border-transparent bg-dominia-accent text-white",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={badgeVariants({ variant, className })} {...props} />;
}

export { Badge, badgeVariants };
