import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useToast } from '@/components/ui/use-toast';
import { notificationService } from '@/lib/notification.service';
import { NotificationPayload } from '@/types/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const { toast } = useToast();

  const fetchInitialData = useCallback(async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        notificationService.getUnreadCount().catch(() => null),
        notificationService.getAll(1, 20).catch(() => null)
      ]);
      if (countRes && countRes.isSuccess) {
        setUnreadCount(countRes.data);
      }
      if (listRes && listRes.isSuccess && listRes.data) {
        setNotifications(listRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch initial notifications", error);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    const hubUrl = `${baseUrl}/hubs/notifications`;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem('token') || '';
          }
          return '';
        }
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('SignalR Connected');
          
          connection.on('ReciveNotification', (notification: NotificationPayload) => {
            setUnreadCount((prev) => prev + 1);
            setNotifications((prev) => [notification, ...prev]);
            
            toast({
              title: notification.titleEn || notification.titleAr,
              description: notification.messageEn || notification.messageAr,
            });
          });
        })
        .catch(err => console.error('SignalR Connection Error: ', err));

      return () => {
        connection.stop();
      };
    }
  }, [connection, toast]);

  const markAsRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (notif && notif.isRead) return;

    try {
      // Optimistically update
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      await notificationService.markAsRead(id);
    } catch (error) {
      console.error("Failed to mark as read", error);
      // Optional: Revert state on failure
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead
  };
}
