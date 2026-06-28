export interface MenuItem {
	name: string;
	description?: string;
	price: number;
}

export interface MenuData {
	restaurant: string;
	sections: Record<string, MenuItem[]>;
	extras: MenuItem[];
}
