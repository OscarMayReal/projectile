import { SidebarMenuButton } from "../ui/sidebar";
import { usePathname } from "next/navigation";

export function SidebarItem({Icon, label, location, onClick}: {Icon: React.JSX.ElementType, label: string, location?: {mode?: "includes" | 'equals', path?: string}, onClick?: () => void}) {
    const pathName = usePathname();
    return (
        <SidebarMenuButton tooltip={label} onClick={onClick} className={location?.mode === "equals" ? (location.path === pathName ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "") : (location?.path && pathName.includes(location.path) ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "")} >
            <Icon />
            {label}
        </SidebarMenuButton>
    )
}