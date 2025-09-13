import React, { useState, useEffect } from "react";
import { ExpertTip } from "../entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Search, 
  TrendingUp, 
  Bug, 
  Droplets, 
  Sprout, 
  Scissors, 
  Shield,
  DollarSign,
  Clock,
  Leaf,
  Filter,
  Star
} from "lucide-react";

export default function ExpertTipsPage() {
  const [tips, setTips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      const data = await ExpertTip.list("-created_date");
      setTips(data);
    } catch (error) {
      console.error("Error loading tips:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    pest_control: Bug,
    fertilization: Sprout,
    irrigation: Droplets,
    planting: Leaf,
    harvesting: Scissors,
    soil_management: TrendingUp,
    disease_prevention: Shield
  };

  const categoryColors = {
    pest_control: 'bg-red-100 text-red-800 border-red-300',
    fertilization: 'bg-green-100 text-green-800 border-green-300',
    irrigation: 'bg-blue-100 text-blue-800 border-blue-300',
    planting: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    harvesting: 'bg-orange-100 text-orange-800 border-orange-300',
    soil_management: 'bg-purple-100 text-purple-800 border-purple-300',
    disease_prevention: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 border-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    advanced: 'bg-red-100 text-red-800 border-red-300'
  };

  const costColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300'
  };

  const seasonColors = {
    spring: 'bg-green-100 text-green-800 border-green-300',
    summer: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    autumn: 'bg-orange-100 text-orange-800 border-orange-300',
    winter: 'bg-blue-100 text-blue-800 border-blue-300',
    all_seasons: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (tip.crop_types && tip.crop_types.some(crop => 
                           crop.toLowerCase().includes(searchQuery.toLowerCase())
                         ));
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tip.difficulty_level === selectedDifficulty;
    const matchesSeason = selectedSeason === 'all' || tip.season === selectedSeason || tip.season === 'all_seasons';
    return matchesSearch && matchesCategory && matchesDifficulty && matchesSeason;
  });

  const categories = [
    { id: 'all', name: 'All Tips', icon: TrendingUp },
    { id: 'pest_control', name: 'Pest Control', icon: Bug },
    { id: 'fertilization', name: 'Fertilization', icon: Sprout },
    { id: 'irrigation', name: 'Irrigation', icon: Droplets },
    { id: 'planting', name: 'Planting', icon: Leaf },
    { id: 'harvesting', name: 'Harvesting', icon: Scissors },
    { id: 'disease_prevention', name: 'Disease Prevention', icon: Shield },
    { id: 'soil_management', name: 'Soil Management', icon: TrendingUp }
  ];

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
  const seasons = ['all', 'spring', 'summer', 'autumn', 'winter', 'all_seasons'];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-emerald-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(9).fill(0).map((_, i) => (
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">
            💡 Expert Farming Tips
          </h1>
          <p className="text-emerald-600 text-lg">
            Professional advice and best practices for successful farming
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search tips, crops, or techniques..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm bg-white"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>
                        {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm bg-white"
                  >
                    {seasons.map(season => (
                      <option key={season} value={season}>
                        {season === 'all' ? 'All Seasons' : 
                         season === 'all_seasons' ? 'Year Round' :
                         season.charAt(0).toUpperCase() + season.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-emerald-50">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <category.icon className="w-4 h-4" />
                <span className="text-xs hidden sm:block">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => {
            const IconComponent = categoryIcons[tip.category];
            return (
              <Card key={tip.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105 h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {tip.image_url && (
                      <img
                        src={tip.image_url}
                        alt={tip.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2 text-emerald-900 mb-2">
                        {tip.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={categoryColors[tip.category]}>
                          <div className="flex items-center gap-1">
                            {IconComponent && <IconComponent className="w-3 h-3" />}
                            {tip.category.replace('_', ' ')}
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm line-clamp-4 leading-relaxed">
                    {tip.content}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline" className={difficultyColors[tip.difficulty_level]}>
                      <Star className="w-3 h-3 mr-1" />
                      {tip.difficulty_level}
                    </Badge>
                    
                    {tip.estimated_cost && (
                      <Badge variant="outline" className={costColors[tip.estimated_cost]}>
                        <DollarSign className="w-3 h-3 mr-1" />
                        {tip.estimated_cost} cost
                      </Badge>
                    )}

                    {tip.season && tip.season !== 'all_seasons' && (
                      <Badge variant="outline" className={seasonColors[tip.season]}>
                        <Clock className="w-3 h-3 mr-1" />
                        {tip.season}
                      </Badge>
                    )}
                  </div>

                  {tip.crop_types && tip.crop_types.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Applicable crops:</p>
                      <div className="flex flex-wrap gap-1">
                        {tip.crop_types.slice(0, 3).map((crop, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                            {crop}
                          </Badge>
                        ))}
                        {tip.crop_types.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                            +{tip.crop_types.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Button */}
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    >
                      View Full Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Card */}
        <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{tips.length}</div>
                <div className="text-sm text-emerald-700">Total Tips</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {tips.filter(t => t.difficulty_level === 'beginner').length}
                </div>
                <div className="text-sm text-green-700">Beginner Tips</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(tips.flatMap(t => t.crop_types || [])).size}
                </div>
                <div className="text-sm text-blue-700">Crop Types Covered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {categories.length - 1}
                </div>
                <div className="text-sm text-purple-700">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredTips.length === 0 && (
          <Card className="text-center py-12 border-2 border-dashed border-emerald-200 mt-6">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tips found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedSeason !== 'all'
                  ? "Try adjusting your search terms or filters" 
                  : "No tips available yet"
                }
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setSelectedSeason('all');
                }}
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}