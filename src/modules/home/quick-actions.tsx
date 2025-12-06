import { Link } from "react-router";
import { Plus } from "lucide-react";

import { Button } from "../../components/button";
import { Section } from "./section";

export function QuickActions() {
  return (
    <Section title="Quick actions">
      <div className="flex flex-row gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/products">
            <Plus className="mr-1.5 h-4 w-4" />
            View all products
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/products/new">
            <Plus className="mr-1.5 h-4 w-4 text-primary-foreground/70" />
            Add new product
          </Link>
        </Button>
      </div>
    </Section>
  );
}
