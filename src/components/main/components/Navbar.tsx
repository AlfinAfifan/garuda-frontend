import { Bars, BellFill, Gear } from '@gravity-ui/icons';
import { Avatar, Button, Popover, Separator, useOverlayState } from '@heroui/react';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Notification } from './Notification';
import { SettingProfile } from './SettingProfile';

export function Navbar({ isSidebarCollapsed, setIsSidebarCollapsed, isMobileSidebarOpen, setIsMobileSidebarOpen }: NavbarProps) {
  const settingProfileState = useOverlayState();
  const notificationState = useOverlayState();
  const { data: session } = useSession();

  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);

  const handleOpenProfileSetting = () => {
    setIsProfilePopoverOpen(false);
    settingProfileState.open();
  };

  const handleOpenNotification = () => {
    notificationState.open();
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const sidebarWidthClass = isSidebarCollapsed ? 'w-20' : 'w-72';

  return (
    <nav className="fixed top-0 z-50 w-full h-16 flex items-center bg-primary-600 shadow">
      <div className={`shrink-0 text-center text-white text-2xl font-bold ${sidebarWidthClass}`}>{isSidebarCollapsed ? 'G' : 'Garuda'}</div>

      <div className="flex flex-1 justify-between items-center px-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" isIconOnly className="text-white hover:bg-primary-600 rounded-lg md:hidden" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}>
            <Bars className="w-6 h-6" />
          </Button>
          <Button variant="ghost" isIconOnly className="hidden text-white hover:bg-primary-600 rounded-lg md:inline-flex" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            <Bars className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center gap-7">
          <Button variant="ghost" isIconOnly className="text-white hover:bg-primary-600 rounded-lg" onClick={handleOpenNotification}>
            <BellFill className="w-6 h-6" />
          </Button>

          <Popover isOpen={isProfilePopoverOpen} onOpenChange={setIsProfilePopoverOpen}>
            <Popover.Trigger aria-label="User profile">
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <Avatar.Fallback>{session?.user?.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm text-white font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-white">{session?.user?.email}</p>
                </div>
              </div>
            </Popover.Trigger>
            <Popover.Content className="w-[320px]">
              <Popover.Dialog>
                <Popover.Heading>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar size="md">
                        <Avatar.Fallback>{session?.user?.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold ">{session?.user?.name}</p>
                        <p className="text-sm text-muted">{session?.user?.email}</p>
                      </div>
                    </div>
                    <Button isIconOnly className="rounded-full bg-primary-500 hover:bg-primary-500/90" size="sm" variant="primary" onPress={handleOpenProfileSetting}>
                      <Gear />
                    </Button>
                  </div>
                </Popover.Heading>
                <Separator className="my-3" />
                <Button variant="danger" fullWidth onPress={handleLogout}>
                  Logout
                </Button>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
        </div>
      </div>

      <SettingProfile state={settingProfileState} />
      <Notification state={notificationState} />
    </nav>
  );
}
