'use client';

import { useMiniApp } from '@neynar/react';
import { Button } from '../Button';
import { NeynarAuthButton } from '../NeynarAuthButton';

export function ActionsTab() {
  // --- Hooks ---
  const { actions, added } = useMiniApp();


  // --- Render ---
  return (
    <div className="space-y-3 px-6 w-full max-w-md mx-auto">
      {/* Neynar Authentication */}
      <NeynarAuthButton />

      {/* Mini app actions */}
      <Button
        onClick={() =>
          actions.openUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
        }
        className="w-full"
      >
        Open Link
      </Button>

      <Button onClick={actions.addMiniApp} disabled={added} className="w-full">
        Add Mini App to Client
      </Button>
    </div>
  );
}
