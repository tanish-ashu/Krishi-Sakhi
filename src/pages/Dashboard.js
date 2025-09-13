import React, { useState, useEffect } from "react";
import { Crop, DiseaseDetection, ExpertTip, User } from "../entities/all";
import { InvokeLLM } from "../integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/createPageUrl";
import { 
  Leaf, 
  Search, 
  TrendingUp, 
  Cloud, 
  Plus, 
  Calendar,
  Thermometer,
  Droplets,
  Wind,
  ArrowRight,
  Activity,
  Users,
  Target,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [crops, setCrops] = useState([]);
  const [recentDetections, setRecentDetections] = useState([]);
  const [featuredTips, setFeaturedTips] = useState([]);
  const [weather, setWeather] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.log("User not authenticated:", error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [cropsData, detectionsData, tipsData] = await Promise.all([
        Crop.filter({ status: "active" }, "-created_date", 5),
        DiseaseDetection.list("-created_date", 3),
        ExpertTip.list("-created_date", 4)
      ]);

      setCrops(cropsData);
      setRecentDetections(detectionsData);
      setFeaturedTips(tipsData);

      // Calculate dashboard stats
      const stats = {
        totalCrops: cropsData.length,
        activeCrops: cropsData.filter(c => c.status === 'active').length,
        readyToHarvest: cropsData.filter(c => c.growth_stage === 'harvest_ready').length,
        recentDetections: detectionsData.length
      };
      setDashboardStats(stats);

      // Get weather data
      const weatherData = await InvokeLLM({
        prompt: "Get current weather information for farming. Include temperature, humidity, wind speed, condition, and brief farming advice for today's weather conditions.",
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            temperature: { type: "number" },
            humidity: { type: "number" },
            wind_speed: { type: "number" },
            condition: { type: "string" },
            farming_advice: { type: "string" },
            location: { type: "string" }
          }
        }
      });
      setWeather(weatherData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Detect Disease",
      description: "Scan plant for diseases",
      icon: Search,
      url: createPageUrl("DiseaseDetection"),
      color: "bg-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      title: "Add Crop",
      description: "Register new crop",
      icon: Plus,
      url: createPageUrl("CropManagement"),
      color: "bg-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Get Tips",
      description: "Expert farming advice",
      icon: TrendingUp,
      url: createPageUrl("ExpertTips"),
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Check Weather",
      description: "Weather forecast",
      icon: Cloud,
      url: createPageUrl("Weather"),
      color: "bg-sky-500",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200"
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getCropHealthScore = () => {
    if (crops.length === 0) return 0;
    const healthyStages = ['vegetative', 'flowering', 'fruiting', 'harvest_ready'];
    const healthyCrops = crops.filter(c => healthyStages.includes(c.growth_stage));
    return Math.round((healthyCrops.length / crops.length) * 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-emerald-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-emerald-100 rounded"></div>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="h-64 bg-emerald-100 rounded"></div>
            <div className="h-64 bg-emerald-100 rounded"></div>
            <div className="h-64 bg-emerald-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">
          {getGreeting()}, {currentUser?.full_name || 'Farmer'}! 🌱
        </h1>
        <p className="text-emerald-600">
          Here's what's happening with your crops today
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.url}>
              <Card className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${action.bgColor} ${action.borderColor} border-2`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <Card className="lg:col-span-1 bg-gradient-to-br from-sky-400 to-sky-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Today's Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weather ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{Math.round(weather.temperature)}°C</div>
                    <div className="text-sky-100">{weather.condition}</div>
                    {weather.location && (
                      <div className="text-sky-200 text-sm">{weather.location}</div>
                    )}
                  </div>
                  <Thermometer className="w-8 h-8 text-sky-200" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    {weather.humidity}% Humidity
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4" />
                    {weather.wind_speed} m/s
                  </div>
                </div>
                <div className="bg-sky-500/30 rounded-lg p-3 text-xs">
                  <strong>Today's Advice:</strong> {weather.farming_advice}
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-3">
                <div className="h-8 bg-sky-300/30 rounded"></div>
                <div className="h-4 bg-sky-300/30 rounded w-3/4"></div>
                <div className="h-4 bg-sky-300/30 rounded w-1/2"></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crop Health Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Crop Health Overview
            </CardTitle>
            <Link to={createPageUrl("CropManagement")}>
              <Button variant="outline" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Health Score</span>
                <span className="text-lg font-semibold text-emerald-600">{getCropHealthScore()}%</span>
              </div>
              <Progress value={getCropHealthScore()} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">
                    {crops.filter(c => ['flowering', 'fruiting'].includes(c.growth_stage)).length}
                  </div>
                  <div className="text-sm text-green-700">Thriving</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-lg font-semibold text-yellow-600">
                    {crops.filter(c => c.growth_stage === 'seedling').length}
                  </div>
                  <div className="text-sm text-yellow-700">Growing</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Crops */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Recent Crops ({crops.length})
            </CardTitle>
            <Link to={createPageUrl("CropManagement")}>
              <Button variant="outline" size="sm">
                Manage All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {crops.length > 0 ? (
              <div className="space-y-3">
                {crops.slice(0, 3).map((crop) => (
                  <div key={crop.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <h4 className="font-semibold text-green-900">{crop.name}</h4>
                      <p className="text-sm text-green-600">
                        {crop.variety && `${crop.variety} • `}
                        {crop.field_size && `${crop.field_size} acres • `}
                        Planted {format(new Date(crop.planting_date), "MMM d")}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline" 
                        className="bg-green-100 text-green-800 border-green-300"
                      >
                        {crop.growth_stage?.replace('_', ' ')}
                      </Badge>
                      {crop.growth_stage === 'harvest_ready' && (
                        <div className="text-xs text-orange-600 mt-1 font-medium">
                          Ready to harvest!
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {crops.length > 3 && (
                  <div className="text-center pt-2">
                    <Link to={createPageUrl("CropManagement")}>
                      <Button variant="ghost" size="sm" className="text-emerald-600">
                        View {crops.length - 3} more crops
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Leaf className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No active crops yet. Start by adding your first crop!</p>
                <Link to={createPageUrl("CropManagement")}>
                  <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700">
                    Add Crop
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Disease Detections */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-red-600" />
              Recent Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentDetections.length > 0 ? (
              <div className="space-y-3">
                {recentDetections.map((detection) => (
                  <div key={detection.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">{detection.detected_disease}</h4>
                    <p className="text-sm text-gray-600">{detection.plant_type}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          detection.severity === 'critical' ? 'border-red-300 text-red-700' :
                          detection.severity === 'high' ? 'border-orange-300 text-orange-700' :
                          detection.severity === 'moderate' ? 'border-yellow-300 text-yellow-700' :
                          'border-green-300 text-green-700'
                        }`}
                      >
                        {detection.severity}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {detection.confidence_score}% confidence
                      </span>
                    </div>
                  </div>
                ))}
                <Link to={createPageUrl("DiseaseDetection")}>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Scan New Plant
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm mb-3">No recent scans</p>
                <Link to={createPageUrl("DiseaseDetection")}>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Start Scanning
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Tips */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Featured Tips & Advice
            </CardTitle>
            <Link to={createPageUrl("ExpertTips")}>
              <Button variant="outline" size="sm">
                More Tips <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {featuredTips.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {featuredTips.slice(0, 4).map((tip) => (
                  <div key={tip.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {tip.content.length > 100 
                        ? `${tip.content.substring(0, 100)}...`
                        : tip.content
                      }
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {tip.category?.replace(/_/g, ' ')}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${
                        tip.difficulty_level === 'beginner' ? 'bg-green-50 text-green-700' :
                        tip.difficulty_level === 'intermediate' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {tip.difficulty_level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm mb-3">No tips available yet</p>
                <Link to={createPageUrl("ExpertTips")}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Explore Tips
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Important Reminders */}
      {crops.filter(c => c.growth_stage === 'harvest_ready').length > 0 && (
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="w-5 h-5" />
              Important Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {crops.filter(c => c.growth_stage === 'harvest_ready').map(crop => (
                <div key={crop.id} className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                  <div>
                    <span className="font-medium text-orange-800">{crop.name}</span>
                    {crop.variety && <span className="text-orange-700"> ({crop.variety})</span>}
                    <span className="text-orange-600"> is ready for harvest!</span>
                  </div>
                  <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-200">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}