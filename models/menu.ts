export interface AdminMenu {
  appName: string;
  logoIcon?: string;
  items: AdminMenuItem[];
}

export interface AdminMenuItem {
  title: string;
  route: string;
  icon: string;
}
