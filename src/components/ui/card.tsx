import * as React from "react";

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={
			"rounded-xl border border-dominia-sand/40 bg-white shadow-sm transition-all duration-200 hover:shadow-md " +
			(className || "")
		}
		{...props}
	/>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={`flex flex-col space-y-1.5 p-5 pb-2 ${className || ""}`}
		{...props}
	/>
));
CardHeader.displayName = "CardHeader";

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={`p-5 pt-2 ${className || ""}`} {...props} />
));
CardContent.displayName = "CardContent";

const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={`text-lg font-semibold leading-none tracking-tight text-dominia-brown ${className || ""}`}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={`text-sm text-dominia-tan ${className || ""}`}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
