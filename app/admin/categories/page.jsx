'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminSidebar from '@/components/AdminSidebar';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Plus, Edit, Trash2, FolderTree, Tag } from 'lucide-react';

export default function AdminCategories() {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newSubcategory, setNewSubcategory] = useState({ name: '', description: '', categoryId: '' });

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin-login');
      return;
    }

    if (admin) {
      // Load demo data
      setCategories([
        { id: 1, name: 'Engineering', description: 'Engineering entrance exams', testCount: 45, createdAt: '2024-01-01' },
        { id: 2, name: 'Medical', description: 'Medical entrance exams', testCount: 38, createdAt: '2024-01-02' },
        { id: 3, name: 'Banking', description: 'Banking and finance exams', testCount: 32, createdAt: '2024-01-03' },
        { id: 4, name: 'Civil Services', description: 'UPSC and state civil services', testCount: 28, createdAt: '2024-01-04' },
        { id: 5, name: 'Government', description: 'Government job exams', testCount: 22, createdAt: '2024-01-05' }
      ]);

      setSubcategories([
        { id: 1, name: 'JEE Main', description: 'Joint Entrance Examination Main', categoryId: 1, testCount: 25 },
        { id: 2, name: 'JEE Advanced', description: 'Joint Entrance Examination Advanced', categoryId: 1, testCount: 20 },
        { id: 3, name: 'NEET', description: 'National Eligibility cum Entrance Test', categoryId: 2, testCount: 30 },
        { id: 4, name: 'AIIMS', description: 'All India Institute of Medical Sciences', categoryId: 2, testCount: 8 },
        { id: 5, name: 'IBPS PO', description: 'Institute of Banking Personnel Selection PO', categoryId: 3, testCount: 15 },
        { id: 6, name: 'SBI Clerk', description: 'State Bank of India Clerk', categoryId: 3, testCount: 17 }
      ]);
    }
  }, [admin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now(),
        name: newCategory.name,
        description: newCategory.description,
        testCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '' });
      setIsAddingCategory(false);
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.name.trim() && newSubcategory.categoryId) {
      const subcategory = {
        id: Date.now(),
        name: newSubcategory.name,
        description: newSubcategory.description,
        categoryId: parseInt(newSubcategory.categoryId),
        testCount: 0
      };
      setSubcategories([...subcategories, subcategory]);
      setNewSubcategory({ name: '', description: '', categoryId: '' });
      setIsAddingSubcategory(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, description: category.description });
  };

  const handleUpdateCategory = () => {
    if (editingCategory && newCategory.name.trim()) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: newCategory.name, description: newCategory.description }
          : cat
      ));
      setEditingCategory(null);
      setNewCategory({ name: '', description: '' });
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      setSubcategories(subcategories.filter(sub => sub.categoryId !== categoryId));
    }
  };

  const handleDeleteSubcategory = (subcategoryId) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      setSubcategories(subcategories.filter(sub => sub.id !== subcategoryId));
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
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
              <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
              <p className="text-gray-600">Manage test categories and subcategories</p>
            </div>
            <div className="flex space-x-3">
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>Create a new test category</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Input
                        id="categoryDescription"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        placeholder="Enter category description"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCategory}>Add Category</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddingSubcategory} onOpenChange={setIsAddingSubcategory}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Tag className="h-4 w-4 mr-2" />
                    Add Subcategory
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subcategory</DialogTitle>
                    <DialogDescription>Create a new subcategory under a parent category</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="parentCategory">Parent Category</Label>
                      <select
                        id="parentCategory"
                        value={newSubcategory.categoryId}
                        onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select parent category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="subcategoryName">Subcategory Name</Label>
                      <Input
                        id="subcategoryName"
                        value={newSubcategory.name}
                        onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                        placeholder="Enter subcategory name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subcategoryDescription">Description</Label>
                      <Input
                        id="subcategoryDescription"
                        value={newSubcategory.description}
                        onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                        placeholder="Enter subcategory description"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddingSubcategory(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddSubcategory}>Add Subcategory</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FolderTree className="h-5 w-5 mr-2" />
                  Categories ({categories.length})
                </CardTitle>
                <CardDescription>Main test categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{category.testCount} tests</Badge>
                          <span className="text-xs text-gray-500">Created: {category.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subcategories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Subcategories ({subcategories.length})
                </CardTitle>
                <CardDescription>Subcategories under main categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{subcategory.name}</h3>
                        <p className="text-sm text-gray-600">{subcategory.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            {getCategoryName(subcategory.categoryId)}
                          </Badge>
                          <Badge variant="outline">{subcategory.testCount} tests</Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSubcategory(subcategory.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Category Dialog */}
          <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>Update category information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editCategoryName">Category Name</Label>
                  <Input
                    id="editCategoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="editCategoryDescription">Description</Label>
                  <Input
                    id="editCategoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Enter category description"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateCategory}>Update Category</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}