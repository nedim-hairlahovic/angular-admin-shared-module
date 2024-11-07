export interface AdminMenu {
    appName: string;
    items: AdminMenuItem[];
}

export interface AdminMenuItem {
    title: string;
    route: string;
    icon: string;
}
