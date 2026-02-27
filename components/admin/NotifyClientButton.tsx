"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotifyClientDialog } from "./NotifyClientDialog";

interface NotifyClientButtonProps {
  clientEmail: string;
  clientName: string;
}

export function NotifyClientButton({
  clientEmail,
  clientName,
}: NotifyClientButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5"
      >
        <Mail className="w-3.5 h-3.5" />
        Notify
      </Button>
      <NotifyClientDialog
        open={open}
        onOpenChange={setOpen}
        clientEmail={clientEmail}
        clientName={clientName}
      />
    </>
  );
}
