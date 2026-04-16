import { PersonNutHex } from '@gravity-ui/icons';
import { Avatar, Button, Drawer, Separator, Spinner, Tabs, toast, useOverlayState } from '@heroui/react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';

import { useNotificationAll, useReadAllNotification, useReadByIdNotification } from '@/features/notification/hooks/useNotification';

dayjs.extend(relativeTime);
dayjs.locale('id');

export function Notification({ state }: { state: ReturnType<typeof useOverlayState> }) {
  const { data, isLoading, isError } = useNotificationAll();
  const readByIdNotification = useReadByIdNotification();
  const readAllNotification = useReadAllNotification();

  const notifications = data?.data ?? [];

  const unreadNotifications = useMemo(() => notifications.filter((item) => !item.is_read), [notifications]);
  const readNotifications = useMemo(() => notifications.filter((item) => item.is_read), [notifications]);

  const formatTime = (value?: string | null) => {
    if (!value) {
      return '-';
    }

    return dayjs(value).fromNow();
  };

  const handleReadNotification = async (id: string) => {
    await readByIdNotification.mutateAsync(id);
  };

  const handleMarkAllAsRead = async () => {
    await toast.promise(readAllNotification.mutateAsync(), {
      loading: 'Menandai notifikasi sebagai sudah dibaca...',
      success: 'Semua notifikasi ditandai sudah dibaca.',
      error: 'Gagal menandai notifikasi.',
    });
  };

  const renderNotificationList = (items: NotificationPaginatedResponse[]) => {
    if (isLoading) {
      return (
        <div className="flex min-h-40 items-center justify-center">
          <Spinner aria-label="Memuat notifikasi" />
        </div>
      );
    }

    if (isError) {
      return <p className="text-sm text-rose-600">Gagal memuat notifikasi.</p>;
    }

    if (!items.length) {
      return <p className="text-sm text-slate-500">Tidak ada notifikasi.</p>;
    }

    return (
      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={item.id}>
            <button
              type="button"
              className={`flex w-full items-start gap-5 rounded-xl px-1 py-2 text-left transition hover:bg-slate-50 ${!item.is_read ? 'opacity-100' : 'opacity-75'}`}
              onClick={() => {
                if (!item.is_read) {
                  void handleReadNotification(item.id);
                }
              }}
            >
              <Avatar size="lg" className="bg-primary-200 text-primary-600">
                <PersonNutHex className="size-6" />
              </Avatar>

              <div className="w-full">
                <div className="flex w-full justify-between gap-2">
                  <h1 className="text-base font-medium text-slate-800">{item.title}</h1>
                  <h1 className="text-xs font-normal text-slate-500">{formatTime(item.created_at)}</h1>
                </div>

                <p className="text-sm text-gray-500">{item.message}</p>
              </div>
            </button>

            {index < items.length - 1 && <Separator className="my-2 bg-primary-200" />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="rounded-l-2xl w-lg">
          <Drawer.Header className="pb-4">
            <div className="flex items-center justify-between">
              <Drawer.Heading className="text-xl font-bold text-primary-900">Notifications</Drawer.Heading>
              <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-700" onPress={() => void handleMarkAllAsRead()}>
                Mark all as read
              </Button>
            </div>
          </Drawer.Header>

          <Drawer.Body className="px-0 py-0">
            <Tabs className="w-full">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Options" className="*:data-[selected=true]:text-accent-foreground">
                  <Tabs.Tab id="all">
                    Semua
                    <Tabs.Indicator className="bg-primary-500" />
                  </Tabs.Tab>
                  <Tabs.Tab id="unread">
                    Belum dibaca
                    <Tabs.Indicator className="bg-primary-500" />
                  </Tabs.Tab>
                  <Tabs.Tab id="read">
                    Sudah dibaca
                    <Tabs.Indicator className="bg-primary-500" />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>

              <Tabs.Panel className="mt-7" id="all">
                {renderNotificationList(notifications)}
              </Tabs.Panel>
              <Tabs.Panel className="" id="unread">
                {renderNotificationList(unreadNotifications)}
              </Tabs.Panel>
              <Tabs.Panel className="" id="read">
                {renderNotificationList(readNotifications)}
              </Tabs.Panel>
            </Tabs>
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
