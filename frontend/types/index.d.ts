import { Icons } from "@/components/icons";
import { User } from "@prisma/client";
import type { Icon } from "lucide-react";

type APIResponse<T> = {
   success: boolean;
   response?: T;
   reason?: string;
};

export type NavItem = {
   title: string;
   href: string;
   newTab?: boolean;
   disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
   title: string;
   disabled?: boolean;
   external?: boolean;
   icon?: keyof typeof Icons;
} & (
   | {
        href: string;
        items?: never;
     }
   | {
        href?: string;
        items: NavLink[];
     }
);

export type SiteConfig = {
   name: string;
   links: {
      twitter: string;
      github: string;
   };
};

export type DocsConfig = {
   mainNav: MainNavItem[];
   sidebarNav: SidebarNavItem[];
};

export type MarketingConfig = {
   mainNav: MainNavItem[];
};

export type DashboardConfig = {
   mainNav: MainNavItem[];
   sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
   name: string;
   description: string;
   stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
   Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
      stripeCurrentPeriodEnd: number;
      isPro: boolean;
   };

export type User = {
   user_id: string;
   email: string;
   email_verified: boolean;
   created_at: number;
   updated_at: number;
   last_login: number;
   last_ip: string;
   logins_count: number;
   full_name: string;
   picture: string;
   locale: string;
   role: string;
   disabled: boolean;
};

export type Diagram = {
   id: string;
   created_at: number;
   updated_at: number;
   public: boolean;
   name: string;
   content?: any;
};

export type DiagramUserRole = {
   user_id: string;
   email: string;
   role: string;
   full_name: string;
   picture: string;
};

export type DiagramTemplate = {
   name: string;
   label: string;
   icon: keyof typeof Icons;
};
