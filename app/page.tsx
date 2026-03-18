"use client";

import { ConversationsProvider } from "@/hooks/use-conversations";
import { SidebarContext, useSidebarState } from "@/hooks/use-sidebar";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SidebarMobile } from "@/components/sidebar/sidebar-mobile";
import { ChatContainer } from "@/components/chat/chat-container";

export default function Home() {
  const sidebar = useSidebarState();

  return (
    <ConversationsProvider>
      <SidebarContext.Provider value={sidebar}>
        <div className="flex h-dvh flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            {/* Desktop sidebar */}
            <aside className="hidden w-[280px] border-r md:block">
              <Sidebar />
            </aside>
            {/* Mobile sidebar */}
            <SidebarMobile />
            {/* Main chat area */}
            <main className="flex flex-1 flex-col overflow-hidden">
              <ChatContainer />
            </main>
          </div>
        </div>
      </SidebarContext.Provider>
    </ConversationsProvider>
  );
}
