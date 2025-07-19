'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import AdminSidebar from '@/components/AdminSidebar';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Plus, Send, Mail, MessageSquare, Bell, Users, Calendar, CheckCircle } from 'lucide-react';

export default function AdminNotifications() {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isComposing, setIsComposing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [newNotification, setNewNotification] = useState({
    type: 'email',
    recipients: 'all',
    subject: '',
    message: '',
    scheduleType: 'now',
    scheduleDateTime: ''
  });

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin-login');
      return;
    }

    if (admin) {
      // Load demo data
      setNotifications([
        {
          id: 1,
          type: 'email',
          subject: 'Welcome to TestYukti!',
          message: 'Thank you for joining our platform...',
          recipients: 'new_users',
          recipientCount: 150,
          status: 'sent',
          sentAt: '2024-01-15T10:00:00Z',
          deliveredCount: 148,
          openedCount: 95
        },
        {
          id: 2,
          type: 'sms',
          subject: 'Test Reminder',
          message: 'Your JEE Mock Test starts in 1 hour...',
          recipients: 'test_registered',
          recipientCount: 500,
          status: 'sent',
          sentAt: '2024-01-14T09:00:00Z',
          deliveredCount: 495,
          openedCount: 0
        },
        {
          id: 3,
          type: 'push',
          subject: 'New Test Series Available',
          message: 'Check out our latest NEET test series...',
          recipients: 'all_users',
          recipientCount: 2500,
          status: 'scheduled',
          scheduledFor: '2024-01-20T18:00:00Z',
          deliveredCount: 0,
          openedCount: 0
        }
      ]);

      setTemplates([
        {
          id: 1,
          name: 'Welcome Email',
          type: 'email',
          subject: 'Welcome to TestYukti!',
          content: 'Dear {{name}}, Welcome to TestYukti platform...'
        },
        {
          id: 2,
          name: 'Test Reminder',
          type: 'sms',
          subject: 'Test Reminder',
          content: 'Hi {{name}}, your test "{{test_name}}" starts at {{time}}.'
        },
        {
          id: 3,
          name: 'Result Available',
          type: 'email',
          subject: 'Your Test Results are Ready',
          content: 'Dear {{name}}, your results for {{test_name}} are now available...'
        }
      ]);
    }
  }, [admin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  const handleSendNotification = () => {
    if (!newNotification.message.trim()) {
      alert('Please enter a message');
      return;
    }

    const notification = {
      id: Date.now(),
      type: newNotification.type,
      subject: newNotification.subject,
      message: newNotification.message,
      recipients: newNotification.recipients,
      recipientCount: getRecipientCount(newNotification.recipients),
      status: newNotification.scheduleType === 'now' ? 'sending' : 'scheduled',
      sentAt: newNotification.scheduleType === 'now' ? new Date().toISOString() : null,
      scheduledFor: newNotification.scheduleType === 'later' ? newNotification.scheduleDateTime : null,
      deliveredCount: 0,
      openedCount: 0
    };

    setNotifications([notification, ...notifications]);
    setNewNotification({
      type: 'email',
      recipients: 'all',
      subject: '',
      message: '',
      scheduleType: 'now',
      scheduleDateTime: ''
    });
    setIsComposing(false);
    setSelectedTemplate('');
  };

  const getRecipientCount = (recipientType) => {
    switch (recipientType) {
      case 'all': return 2500;
      case 'active_users': return 2200;
      case 'new_users': return 150;
      case 'premium_users': return 800;
      case 'test_registered': return 500;
      default: return 0;
    }
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      setNewNotification({
        ...newNotification,
        type: template.type,
        subject: template.subject,
        message: template.content
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onSignOut={handleSignOut} />
      
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">Send and manage user notifications</p>
            </div>
            <Dialog open={isComposing} onOpenChange={setIsComposing}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Compose Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Compose Notification</DialogTitle>
                  <DialogDescription>Send email, SMS, or push notifications to users</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="notificationType">Notification Type</Label>
                      <Select value={newNotification.type} onValueChange={(value) => setNewNotification({ ...newNotification, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="push">Push Notification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="recipients">Recipients</Label>
                      <Select value={newNotification.recipients} onValueChange={(value) => setNewNotification({ ...newNotification, recipients: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users (2500)</SelectItem>
                          <SelectItem value="active_users">Active Users (2200)</SelectItem>
                          <SelectItem value="new_users">New Users (150)</SelectItem>
                          <SelectItem value="premium_users">Premium Users (800)</SelectItem>
                          <SelectItem value="test_registered">Test Registered (500)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="template">Use Template (Optional)</Label>
                    <Select value={selectedTemplate} onValueChange={(value) => {
                      setSelectedTemplate(value);
                      if (value) handleTemplateSelect(value);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.filter(t => t.type === newNotification.type).map(template => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(newNotification.type === 'email' || newNotification.type === 'push') && (
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={newNotification.subject}
                        onChange={(e) => setNewNotification({ ...newNotification, subject: e.target.value })}
                        placeholder="Enter subject"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                      placeholder="Enter your message"
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label>Schedule</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sendNow"
                          checked={newNotification.scheduleType === 'now'}
                          onCheckedChange={(checked) => checked && setNewNotification({ ...newNotification, scheduleType: 'now' })}
                        />
                        <Label htmlFor="sendNow">Send Now</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="scheduleLater"
                          checked={newNotification.scheduleType === 'later'}
                          onCheckedChange={(checked) => checked && setNewNotification({ ...newNotification, scheduleType: 'later' })}
                        />
                        <Label htmlFor="scheduleLater">Schedule for Later</Label>
                      </div>
                      {newNotification.scheduleType === 'later' && (
                        <Input
                          type="datetime-local"
                          value={newNotification.scheduleDateTime}
                          onChange={(e) => setNewNotification({ ...newNotification, scheduleDateTime: e.target.value })}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsComposing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendNotification}>
                      <Send className="h-4 w-4 mr-2" />
                      {newNotification.scheduleType === 'now' ? 'Send Now' : 'Schedule'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {notifications.filter(n => n.status === 'sent').length}
                    </p>
                  </div>
                  <Send className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Scheduled</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {notifications.filter(n => n.status === 'scheduled').length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Delivery Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round((notifications.reduce((sum, n) => sum + n.deliveredCount, 0) / 
                        notifications.reduce((sum, n) => sum + n.recipientCount, 0)) * 100) || 0}%
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Open Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round((notifications.reduce((sum, n) => sum + n.openedCount, 0) / 
                        notifications.reduce((sum, n) => sum + n.deliveredCount, 0)) * 100) || 0}%
                    </p>
                  </div>
                  <Mail className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification History</CardTitle>
                  <CardDescription>All sent and scheduled notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 rounded-lg p-3">
                            {getTypeIcon(notification.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{notification.subject}</h3>
                              <Badge className={getStatusColor(notification.status)}>
                                {notification.status}
                              </Badge>
                              <Badge variant="outline">{notification.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message.substring(0, 100)}...</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {notification.recipientCount} recipients
                              </span>
                              {notification.sentAt && (
                                <span>Sent: {formatDate(notification.sentAt)}</span>
                              )}
                              {notification.scheduledFor && (
                                <span>Scheduled: {formatDate(notification.scheduledFor)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {notification.deliveredCount}/{notification.recipientCount} delivered
                          </div>
                          {notification.type === 'email' && (
                            <div className="text-xs text-gray-500">
                              {notification.openedCount} opened
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Templates</CardTitle>
                  <CardDescription>Pre-defined templates for common notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="bg-purple-100 rounded-lg p-3">
                            {getTypeIcon(template.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{template.name}</h3>
                              <Badge variant="outline">{template.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{template.subject}</p>
                            <p className="text-xs text-gray-500">{template.content.substring(0, 100)}...</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template.id.toString());
                              handleTemplateSelect(template.id);
                              setIsComposing(true);
                            }}
                          >
                            Use Template
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}