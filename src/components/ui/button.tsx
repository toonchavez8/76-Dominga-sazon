"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dominia-border focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
	{
		variants: {
			variant: {
				default:
					"bg-dominia-accent text-white hover:bg-dominia-chili hover:shadow-lg hover:scale-105",
				secondary:
					"bg-dominia-gold text-dominia-brown hover:bg-dominia-orange hover:shadow-lg hover:scale-105",
				outline:
					"border-2 border-dominia-border bg-transparent text-dominia-brown hover:bg-dominia-cream hover:text-dominia-dark-brown",
				ghost:
					"text-dominia-brown hover:bg-dominia-cream hover:text-dominia-dark-brown",
				link: "text-dominia-accent underline-offset-4 hover:underline",
				gold: "bg-dominia-gold text-dominia-brown hover:bg-dominia-orange hover:shadow-lg hover:scale-105",
			},
			size: {
				default: "h-10 px-6 py-3",
				sm: "h-9 px-4 py-2 text-xs",
				lg: "h-12 px-8 py-4 text-base",
				icon: "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={buttonVariants({ variant, size, className })}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
