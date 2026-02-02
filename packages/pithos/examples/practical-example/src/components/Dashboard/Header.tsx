import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FormattedUser } from "@/lib/types";

type HeaderProps = {
  user: FormattedUser;
};

export function Header({ user }: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{user.fullName}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Badge variant="secondary">{user.role}</Badge>
        </div>
      </div>
    </header>
  );
}
