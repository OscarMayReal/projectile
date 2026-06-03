"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { UserIcon } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { useAuth } from "./authManager";

export function UserItem() {
    const { user } = useAuth();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto">
                    {/* <Item className="p-0">
                        <ItemMedia>
                            <UserIcon />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>{user?.user.name || 'User'}</ItemTitle>
                        </ItemContent>
                    </Item> */}
                    <UserIcon />
                    {user?.user.name || 'User'}
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}