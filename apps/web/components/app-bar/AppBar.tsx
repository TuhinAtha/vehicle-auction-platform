import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { LogoutButton } from "./LogoutButton"
import { NavLink } from "./NavLink"

type AppBarProps = {
  navs: { path: string; text: string; exact?: boolean }[]
}
export const AppBar = ({ navs }: AppBarProps) => {
  return (
    <header className="fixed top-0 w-full border-b bg-background">
      <div className="flex h-14 items-center px-4">
        <div className="font-semibold">{process.env.WEB_APP_NAME}</div>

        <NavigationMenu className="ml-8">
          <NavigationMenuList className="gap-1">
            {navs.map(({ path, text, exact }) => (
              <NavLink href={path} exact={exact} key={path}>
                {text}
              </NavLink>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto">
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
