import React, { useState, useEffect } from "react";
import { Crop } from "../entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { format } from "date-fns";
import { 
  Leaf, 
  Plus, 
  Calendar as CalendarIcon, 
  MapPin, 
  Edit, 
  Trash2,
  Sprout,
  Wheat,
  Eye
} from "lucide-react";

export default function CropManagementPage() {
  const [crops, setCrops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    planting_date: '',
    expected_harvest_date: '',
    field_size: '',
    growth_stage: 'seedling',
    location: '',
    notes: '',
    status: 'active'
  });

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      const data = await Crop.list("-created_date");
      setCrops(data);
    } catch (error) {
      console.error("Error loading crops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        field_size: formData.field_size ? parseFloat(formData.field_size) : null
      };

      if (editingCrop) {
        await Crop.update(editingCrop.id, submitData);
      } else {
        await Crop.create(submitData);
      }
      resetForm();
      loadCrops();
    } catch (error) {
      console.error("Error saving crop:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      variety: '',
      planting_date: '',
      expected_harvest_date: '',
      field_size: '',
      growth_stage: 'seedling',
      location: '',
      notes: '',
      status: 'active'
    });
    setShowForm(false);
    setEditingCrop(null);
  };

  const handleEdit = (crop) => {
    setFormData({
      name: crop.name || '',
      variety: crop.variety || '',
      planting_date: crop.planting_date || '',
      expected_harvest_date: crop.expected_harvest_date || '',
      field_size: crop.field_size ? crop.field_size.toString() : '',
      growth_stage: crop.growth_stage || 'seedling',
      location: crop.location || '',
      notes: crop.notes || '',
      status: crop.status || 'active'
    });
    setEditingCrop(crop);
    setShowForm(true);
  };

  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await Crop.delete(cropId);
        loadCrops();
      } catch (error) {
        console.error("Error deleting crop:", error);
      }
    }
  };

  const handleStatusChange = async (crop, newStatus) => {
    try {
      await Crop.update(crop.id, { ...crop, status: newStatus });
      loadCrops();
    } catch (error) {
      console.error("Error updating crop status:", error);
    }
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'seedling': return <Sprout className="w-4 h-4" />;
      case 'vegetative': return <Leaf className="w-4 h-4" />;
      case 'flowering': return <span className="text-sm">🌸</span>;
      case 'fruiting': return <span className="text-sm">🍎</span>;
      case 'harvest_ready': return <Wheat className="w-4 h-4" />;
      default: return <Leaf className="w-4 h-4" />;
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'seedling': return 'bg-green-100 text-green-800 border-green-300';
      case 'vegetative': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'flowering': return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'fruiting': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'harvest_ready': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'harvested': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-emerald-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-emerald-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">
              🌾 Crop Management
            </h1>
            <p className="text-emerald-600">
              Track and manage your crops throughout their lifecycle
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Crop
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-8 border-2 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                {editingCrop ? 'Edit Crop' : 'Add New Crop'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Crop Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Tomatoes, Wheat, Rice"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variety">Variety</Label>
                    <Input
                      id="variety"
                      value={formData.variety}
                      onChange={(e) => setFormData({...formData, variety: e.target.value})}
                      placeholder="e.g., Cherry, Beefsteak"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="planting_date">Planting Date *</Label>
                    <Input
                      id="planting_date"
                      type="date"
                      value={formData.planting_date}
                      onChange={(e) => setFormData({...formData, planting_date: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expected_harvest_date">Expected Harvest Date</Label>
                    <Input
                      id="expected_harvest_date"
                      type="date"
                      value={formData.expected_harvest_date}
                      onChange={(e) => setFormData({...formData, expected_harvest_date: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field_size">Field Size (acres)</Label>
                    <Input
                      id="field_size"
                      type="number"
                      step="0.1"
                      value={formData.field_size}
                      onChange={(e) => setFormData({...formData, field_size: e.target.value})}
                      placeholder="e.g., 2.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="growth_stage">Growth Stage</Label>
                    <Select
                      value={formData.growth_stage}
                      onValueChange={(value) => setFormData({...formData, growth_stage: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seedling">Seedling</SelectItem>
                        <SelectItem value="vegetative">Vegetative</SelectItem>
                        <SelectItem value="flowering">Flowering</SelectItem>
                        <SelectItem value="fruiting">Fruiting</SelectItem>
                        <SelectItem value="harvest_ready">Harvest Ready</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="harvested">Harvested</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Field location or GPS coordinates"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Any additional notes about this crop..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {editingCrop ? 'Update Crop' : 'Add Crop'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Crops Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <Card key={crop.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-emerald-900">{crop.name}</CardTitle>
                    {crop.variety && (
                      <p className="text-sm text-emerald-600 mt-1">{crop.variety}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(crop)}
                      className="h-8 w-8 text-gray-500 hover:text-emerald-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(crop.id)}
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={getStageColor(crop.growth_stage)}>
                    <div className="flex items-center gap-1">
                      {getStageIcon(crop.growth_stage)}
                      {crop.growth_stage.replace('_', ' ')}
                    </div>
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(crop.status)}>
                    {crop.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Planted: {format(new Date(crop.planting_date), "MMM d, yyyy")}
                  </div>
                  
                  {crop.expected_harvest_date && (
                    <div className="flex items-center gap-2">
                      <Wheat className="w-4 h-4" />
                      Expected harvest: {format(new Date(crop.expected_harvest_date), "MMM d, yyyy")}
                    </div>
                  )}
                  
                  {crop.field_size && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Field size: {crop.field_size} acres
                    </div>
                  )}
                  
                  {crop.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {crop.location}
                    </div>
                  )}
                </div>

                {crop.notes && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-sm text-emerald-800">{crop.notes}</p>
                  </div>
                )}

                {/* Quick Status Actions */}
                <div className="flex gap-2 pt-2">
                  {crop.status === 'active' && crop.growth_stage === 'harvest_ready' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(crop, 'harvested')}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Mark as Harvested
                    </Button>
                  )}
                  {crop.status === 'harvested' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(crop, 'active')}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      Reactivate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {crops.length === 0 && !showForm && (
          <Card className="text-center py-12 border-2 border-dashed border-emerald-200">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No crops added yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start managing your crops by adding your first crop
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Add Your First Crop
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}