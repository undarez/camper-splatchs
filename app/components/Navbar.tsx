import { Button } from "@/app/components/ui/button";
import { Sheet, SheetTrigger } from "@/app/components/ui/sheet";
import { Menu } from "lucide-react";

<div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="flex items-center">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      {/* ... reste du code ... */}
    </Sheet>
    {/* ... reste du code ... */}
  </div>
  {/* ... reste du code ... */}
</div>;

// ... existing code ...
