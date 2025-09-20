import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChefHat, Settings, User, LogOut, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong border-b"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <ChefHat className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-heading font-bold">
            Cooked<span className="text-accent">IN</span>
          </h1>
        </motion.div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative cursor-pointer"
            >
              <Avatar className="w-10 h-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-heading font-semibold">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-0 hover:opacity-20 transition-opacity"
                layoutId="avatar-glow"
              />
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="glass-strong border w-56 mt-2"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                <User className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-destructive/10 text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
