"use client";

import { useState } from "react";
import type { MenuData } from "../types/menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface MenuSectionProps {
	menuData: MenuData;
}

const categoryLabels: Record<string, string> = {
	alimentos: "Alimentos",
	bebidas: "Bebidas",
	extras: "Extras",
};

function MenuItem({
	name,
	description,
	price,
}: {
	name: string;
	description?: string;
	price: number;
}) {
	return (
		<div
			className="group flex items-start justify-between gap-4 py-4 border-b last:border-b-0"
			style={{ borderColor: "rgba(224, 219, 213, 0.6)" }}
		>
			<div className="flex-1 min-w-0">
				<h4 className="text-base font-semibold text-dominia-ink leading-snug">
					{name}
				</h4>
				{description && (
					<p className="text-sm mt-0.5 text-dominia-slate leading-relaxed">
						{description}
					</p>
				)}
			</div>
			<span
				className="shrink-0 text-base font-semibold tabular-nums whitespace-nowrap"
				style={{ color: "var(--color-dominia-terracotta)" }}
			>
				${price}
			</span>
		</div>
	);
}

function CategoryGroup({
	title,
	items,
}: {
	title: string;
	items: { name: string; description?: string; price: number }[];
}) {
	return (
		<div className="mb-8 last:mb-0">
			<h3
				className="text-sm font-semibold uppercase tracking-[0.15em] mb-3"
				style={{ color: "var(--color-dominia-warm-gray)" }}
			>
				{title}
			</h3>
			<div>
				{items.map((item, idx) => (
					<MenuItem key={`${title}-${idx}`} {...item} />
				))}
			</div>
		</div>
	);
}

export default function MenuSection({ menuData }: MenuSectionProps) {
	const [activeTab, setActiveTab] = useState<string>("alimentos");

	const categories = Object.keys(menuData.sections);

	return (
		<div className="w-full max-w-2xl mx-auto">
			{/* Category Tabs — clean, minimal */}
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v)}
				className="w-full"
			>
				<div className="flex justify-center mb-10 sm:mb-12">
					<TabsList className="gap-0.5">
						{categories.map((cat) => (
							<TabsTrigger key={cat} value={cat}>
								{categoryLabels[cat] || cat}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				{/* Alimentos tab */}
				<TabsContent value="alimentos">
					{menuData.sections.alimentos.map((item, idx) => (
						<MenuItem key={`alimento-${idx}`} {...item} />
					))}
				</TabsContent>

				{/* Bebidas tab */}
				<TabsContent value="bebidas">
					{menuData.sections.bebidas.map((item, idx) => (
						<MenuItem key={`bebida-${idx}`} {...item} />
					))}
				</TabsContent>

				{/* Extras tab */}
				<TabsContent value="extras">
					{menuData.extras.length > 0 ? (
						menuData.extras.map((item, idx) => (
							<MenuItem key={`extra-${idx}`} {...item} />
						))
					) : (
						<p className="text-sm text-dominia-warm-gray py-4">
							Sin extras disponibles por ahora.
						</p>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
