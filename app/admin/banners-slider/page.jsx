'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';  // Next.js Image component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminSidebar from '@/components/AdminSidebar';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

// Rename lucide's Image icon import to avoid conflict with next/image
import { Image as ImageIcon } from 'lucide-react';

export default function AdminBannersSlider() {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [featuredTests, setFeaturedTests] = useState([]);
  const [testSeries, setTestSeries] = useState([]);
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    buttonText: 'Learn More',
    isActive: true,
    order: 1
  });

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin-login');
      return;
    }

    if (admin) {
      // Load demo data
      setBanners([
        {
          id: 1,
          title: 'JEE Main 2024 Preparation',
          subtitle: 'Master Your Engineering Dreams',
          description: 'Comprehensive test series with 1000+ questions and detailed analytics',
          imageUrl: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
          linkUrl: '/test-series/1',
          buttonText: 'Start Preparing',
          isActive: true,
          order: 1,
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          title: 'NEET 2024 Mock Tests',
          subtitle: 'Your Medical Career Starts Here',
          description: 'Practice with latest pattern questions and get All India ranking',
          imageUrl: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
          linkUrl: '/test-series/2',
          buttonText: 'Take Mock Test',
          isActive: true,
          order: 2,
          createdAt: '2024-01-02'
        },
        {
          id: 3,
          title: 'Banking PO Complete Package',
          subtitle: 'Secure Your Banking Future',
          description: 'Complete preparation package for all banking exams',
          imageUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg',
          linkUrl: '/test-series/3',
          buttonText: 'Explore Now',
          isActive: false,
          order: 3,
          createdAt: '2024-01-03'
        }
      ]);

      setTestSeries([
        { id: 1, title: 'JEE Main Complete Series', category: 'Engineering' },
        { id: 2, title: 'NEET Biology Practice', category: 'Medical' },
        { id: 3, title: 'Banking PO Package', category: 'Banking' },
        { id: 4, title: 'UPSC Prelims Series', category: 'Civil Services' }
      ]);

      setFeaturedTests([1, 2]); // Featured test series IDs
    }
  }, [admin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  const handleAddBanner = () => {
    if (newBanner.title.trim() && newBanner.imageUrl.trim()) {
      const banner = {
        id: Date.now(),
        ...newBanner,
        order: parseInt(newBanner.order),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBanners([...banners, banner]);
      setNewBanner({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        buttonText: 'Learn More',
        isActive: true,
        order: 1
      });
      setIsAddingBanner(false);
    }
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setNewBanner({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      buttonText: banner.buttonText,
      isActive: banner.isActive,
      order: banner.order
    });
  };

  const handleUpdateBanner = () => {
    if (editingBanner && newBanner.title.trim() && newBanner.imageUrl.trim()) {
      setBanners(banners.map(banner => 
        banner.id === editingBanner.id 
          ? { ...banner, ...newBanner, order: parseInt(newBanner.order) }
          : banner
      ));
      setEditingBanner(null);
      setNewBanner({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        buttonText: 'Learn More',
        isActive: true,
        order: 1
      });
    }
  };

  const handleDeleteBanner = (bannerId) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter(banner => banner.id !== bannerId));
    }
  };

  const toggleBannerStatus = (bannerId) => {
    setBanners(banners.map(banner => 
      banner.id === bannerId ? { ...banner, isActive: !banner.isActive } : banner
    ));
  };

  const toggleFeaturedTest = (testId) => {
    setFeaturedTests(prev => 
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
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
              <h1 className="text-2xl font-bold text-gray-900">Banners & Slider</h1>
              <p className="text-gray-600">Manage homepage banners and featured content</p>
            </div>
            <Dialog open={isAddingBanner} onOpenChange={setIsAddingBanner}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Banner</DialogTitle>
                  <DialogDescription>Create a new banner for the homepage slider</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bannerTitle">Banner Title</Label>
                      <Input
                        id="bannerTitle"
                        value={newBanner.title}
                        onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                        placeholder="Enter banner title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bannerSubtitle">Subtitle</Label>
                      <Input
                        id="bannerSubtitle"
                        value={newBanner.subtitle}
                        onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                        placeholder="Enter subtitle"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bannerDescription">Description</Label>
                    <Textarea
                      id="bannerDescription"
                      value={newBanner.description}
                      onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                      placeholder="Enter banner description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={newBanner.imageUrl}
                      onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                      placeholder="Enter image URL (e.g., from Pexels)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkUrl">Link URL</Label>
                      <Input
                        id="linkUrl"
                        value={newBanner.linkUrl}
                        onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                        placeholder="Enter link URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonText">Button Text</Label>
                      <Input
                        id="buttonText"
                        value={newBanner.buttonText}
                        onChange={(e) => setNewBanner({ ...newBanner, buttonText: e.target.value })}
                        placeholder="Enter button text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="order">Display Order</Label>
                      <Input
                        id="order"
                        type="number"
                        value={newBanner.order}
                        onChange={(e) => setNewBanner({ ...newBanner, order: e.target.value })}
                        min="1"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="isActive"
                        checked={newBanner.isActive}
                        onCheckedChange={(checked) => setNewBanner({ ...newBanner, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active Banner</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddingBanner(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddBanner}>Add Banner</Button>
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
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Banners</p>
                  <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
                </div>
                <ImageIcon className="h-8 w-8 text-blue-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Banners</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {banners.filter(banner => banner.isActive).length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Featured Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{featuredTests.length}</p>
                </div>
                <Plus className="h-8 w-8 text-purple-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Test Series</p>
                  <p className="text-2xl font-bold text-gray-900">{testSeries.length}</p>
                </div>
                <Plus className="h-8 w-8 text-orange-500" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Banners Management */}
            <Card>
              <CardHeader>
                <CardTitle>Homepage Banners</CardTitle>
                <CardDescription>Manage slider banners for the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {banners.sort((a, b) => a.order - b.order).map((banner) => (
                    <div key={banner.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                            <Badge className={banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {banner.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">Order {banner.order}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{banner.subtitle}</p>
                          <p className="text-xs text-gray-500">{banner.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBannerStatus(banner.id)}
                            aria-label={banner.isActive ? 'Deactivate banner' : 'Activate banner'}
                          >
                            {banner.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBanner(banner)}
                            aria-label="Edit banner"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="text-red-600 hover:text-red-700"
                            aria-label="Delete banner"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {banner.imageUrl && (
                        <div className="relative w-full h-32 rounded-md overflow-hidden mt-3">
                          <Image 
                            src={banner.imageUrl} 
                            alt={banner.title || 'Banner Image'}
                            fill
                            sizes="(max-width: 768px) 100vw, 500px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Test Series</CardTitle>
                <CardDescription>Select test series to feature on homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testSeries.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={featuredTests.includes(test.id)}
                          onCheckedChange={() => toggleFeaturedTest(test.id)}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{test.title}</h3>
                          <p className="text-sm text-gray-600">{test.category}</p>
                        </div>
                      </div>
                      {featuredTests.includes(test.id) && (
                        <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Banner Dialog */}
          <Dialog open={!!editingBanner} onOpenChange={() => setEditingBanner(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Banner</DialogTitle>
                <DialogDescription>Update banner information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editBannerTitle">Banner Title</Label>
                    <Input
                      id="editBannerTitle"
                      value={newBanner.title}
                      onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                      placeholder="Enter banner title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editBannerSubtitle">Subtitle</Label>
                    <Input
                      id="editBannerSubtitle"
                      value={newBanner.subtitle}
                      onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                      placeholder="Enter subtitle"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editBannerDescription">Description</Label>
                  <Textarea
                    id="editBannerDescription"
                    value={newBanner.description}
                    onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                    placeholder="Enter banner description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="editImageUrl">Image URL</Label>
                  <Input
                    id="editImageUrl"
                    value={newBanner.imageUrl}
                    onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editLinkUrl">Link URL</Label>
                    <Input
                      id="editLinkUrl"
                      value={newBanner.linkUrl}
                      onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                      placeholder="Enter link URL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editButtonText">Button Text</Label>
                    <Input
                      id="editButtonText"
                      value={newBanner.buttonText}
                      onChange={(e) => setNewBanner({ ...newBanner, buttonText: e.target.value })}
                      placeholder="Enter button text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editOrder">Display Order</Label>
                    <Input
                      id="editOrder"
                      type="number"
                      value={newBanner.order}
                      onChange={(e) => setNewBanner({ ...newBanner, order: e.target.value })}
                      min="1"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="editIsActive"
                      checked={newBanner.isActive}
                      onCheckedChange={(checked) => setNewBanner({ ...newBanner, isActive: checked })}
                    />
                    <Label htmlFor="editIsActive">Active Banner</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingBanner(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateBanner}>Update Banner</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
