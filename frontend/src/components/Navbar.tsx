import { Link } from "react-router-dom"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu"
  

function Navbar() {
  return (
    <div className="w-full flex justify-between items-center">
        <h2>React Chatt App</h2>
        <ul className="hidden sm:flex">
          <li><Link to={"/#"}>Profile</Link></li>
        </ul>

        <div className="block sm:hidden">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-base">Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink>Profile</NavigationMenuLink>
                        <NavigationMenuLink>Setting</NavigationMenuLink>
                    </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    </div>
  )
}

export default Navbar