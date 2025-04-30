import API from "../utils/axios";

class NotificationService {
  async getAllNotifications() {
    try {
      const response = await API.get("/notifications");
      const notifications = response.data;

      return Array.isArray(notifications)
        ? notifications.map(this.formatNotification)
        : [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async getUnreadCount() {
    try {
      const notifications = await this.getAllNotifications();

      const unreadCount = notifications.filter(
        (notification) => !notification.isRead
      ).length;
      return unreadCount;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await API.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const response = await API.put("/notifications/read-all");
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  formatNotification(notification) {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      subType: notification.sub_type,
      relatedId: notification.related_id,
      isRead: notification.is_read,
      timestamp: notification.created_at,
      metadata: notification.metadata
        ? JSON.parse(notification.metadata)
        : null,
    };
  }
}

export default new NotificationService();
