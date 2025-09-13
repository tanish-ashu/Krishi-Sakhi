import React, { useState, useEffect } from "react";
import { InvokeLLM } from "../integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  Sunrise,
  Sunset,
  AlertTriangle,
  Leaf,
  Calendar,
  RefreshCw,
  MapPin,
  Activity,
  Sprout
} from "lucide-react";

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [farmingAdvice, setFarmingAdvice] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [bestTimes, setBestTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const data = await InvokeLLM({
        prompt: `Get comprehensive weather information for farming including:
        - Current weather conditions (temperature, humidity, wind, pressure)
        - 7-day forecast with detailed daily information
        - UV index and visibility
        - Sunrise and sunset times
        - Specific farming advice based on current weather
        - Any weather alerts or warnings for farmers
        - Best times for different farming activities today
        - Soil temperature and moisture recommendations
        - Pest and disease risk assessment based on weather`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            current: {
              type: "object",
              properties: {
                temperature: { type: "number" },
                condition: { type: "string" },
                humidity: { type: "number" },
                wind_speed: { type: "number" },
                wind_direction: { type: "string" },
                pressure: { type: "number" },
                uv_index: { type: "number" },
                visibility: { type: "number" },
                sunrise: { type: "string" },
                sunset: { type: "string" },
                location: { type: "string" }
              }
            },
            forecast: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "string" },
                  date: { type: "string" },
                  high_temp: { type: "number" },
                  low_temp: { type: "number" },
                  condition: { type: "string" },
                  precipitation_chance: { type: "number" },
                  wind_speed: { type: "number" },
                  humidity: { type: "number" }
                }
              }
            },
            farming_advice: { type: "string" },
            alerts: {
              type: "array",
              items: { type: "string" }
            },
            best_times: {
              type: "object",
              properties: {
                watering: { type: "string" },
                spraying: { type: "string" },
                harvesting: { type: "string" },
                planting: { type: "string" }
              }
            },
            risks: {
              type: "object",
              properties: {
                pest_risk: { type: "string" },
                disease_risk: { type: "string" },
                frost_risk: { type: "string" }
              }
            }
          }
        }
      });

      setWeatherData(data.current);
      setForecast(data.forecast || []);
      setFarmingAdvice(data.farming_advice);
      setAlerts(data.alerts || []);
      setBestTimes(data.best_times || {});
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const lower = condition?.toLowerCase() || '';
    if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('shower')) 
      return <CloudRain className="w-8 h-8" />;
    if (lower.includes('cloud') || lower.includes('overcast')) 
      return <Cloud className="w-8 h-8" />;
    if (lower.includes('clear') || lower.includes('sunny')) 
      return <Sun className="w-8 h-8" />;
    return <Cloud className="w-8 h-8" />;
  };

  const getConditionColor = (condition) => {
    const lower = condition?.toLowerCase() || '';
    if (lower.includes('rain') || lower.includes('storm')) return 'text-blue-600';
    if (lower.includes('cloud')) return 'text-gray-600';
    if (lower.includes('clear') || lower.includes('sunny')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getUVRiskColor = (uvIndex) => {
    if (uvIndex <= 2) return 'bg-green-100 text-green-800';
    if (uvIndex <= 5) return 'bg-yellow-100 text-yellow-800';
    if (uvIndex <= 7) return 'bg-orange-100 text-orange-800';
    if (uvIndex <= 10) return 'bg-red-100 text-red-800';
    return 'bg-purple-100 text-purple-800';
  };

  const getUVRiskText = (uvIndex) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-emerald-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="h-64 bg-emerald-100 rounded"></div>
              <div className="h-64 bg-emerald-100 rounded"></div>
              <div className="h-64 bg-emerald-100 rounded"></div>
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
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-emerald-900 mb-3">
              🌤️ Weather Forecast
            </h1>
            <p className="text-emerald-600 text-lg">
              Weather conditions and farming recommendations
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            onClick={loadWeatherData}
            variant="outline"
            size="icon"
            className="border-emerald-200 hover:bg-emerald-50"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.map((alert, index) => (
                  <div key={index} className="p-3 bg-orange-100 rounded-lg border border-orange-200">
                    <p className="text-orange-800 text-sm">{alert}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Current Weather */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-sky-400 to-sky-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Current Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weatherData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-bold">
                        {Math.round(weatherData.temperature)}°C
                      </div>
                      <div className="text-sky-100 mt-1">
                        {weatherData.condition}
                      </div>
                      {weatherData.location && (
                        <div className="flex items-center gap-1 text-sky-200 text-sm mt-1">
                          <MapPin className="w-3 h-3" />
                          {weatherData.location}
                        </div>
                      )}
                    </div>
                    <div className={`text-white`}>
                      {getWeatherIcon(weatherData.condition)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4" />
                      {weatherData.humidity}% Humidity
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4" />
                      {weatherData.wind_speed} m/s {weatherData.wind_direction}
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {weatherData.visibility} km
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      {weatherData.pressure} hPa
                    </div>
                  </div>

                  <div className="bg-sky-500/30 rounded-lg p-3">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <Sunrise className="w-4 h-4" />
                        {weatherData.sunrise}
                      </div>
                      <div className="flex items-center gap-1">
                        <Sunset className="w-4 h-4" />
                        {weatherData.sunset}
                      </div>
                    </div>
                    {weatherData.uv_index && (
                      <div className="flex justify-center">
                        <Badge className={getUVRiskColor(weatherData.uv_index)}>
                          UV {weatherData.uv_index} - {getUVRiskText(weatherData.uv_index)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-12 bg-sky-300/30 rounded"></div>
                  <div className="h-4 bg-sky-300/30 rounded w-3/4"></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Farming Advice */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Today's Farming Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              {farmingAdvice ? (
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-emerald-800 leading-relaxed">{farmingAdvice}</p>
                </div>
              ) : (
                <div className="h-24 bg-emerald-100 rounded animate-pulse"></div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Best Times for Activities */}
        {Object.keys(bestTimes).length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(bestTimes).map(([activity, time]) => {
              const icons = {
                watering: Droplets,
                spraying: Leaf,
                harvesting: Sun,
                planting: Sprout
              };
              const colors = {
                watering: 'text-blue-600 bg-blue-50 border-blue-200',
                spraying: 'text-green-600 bg-green-50 border-green-200',
                harvesting: 'text-orange-600 bg-orange-50 border-orange-200',
                planting: 'text-emerald-600 bg-emerald-50 border-emerald-200'
              };
              const Icon = icons[activity] || Activity;
              
              return (
                <Card key={activity} className={`${colors[activity]} border-2`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`flex items-center gap-2 text-sm ${colors[activity].split(' ')[0]}`}>
                      <Icon className="w-4 h-4" />
                      Best {activity.charAt(0).toUpperCase() + activity.slice(1)} Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-lg font-semibold ${colors[activity].split(' ')[0]}`}>
                      {time}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* 7-Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              7-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            {forecast.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-900 mb-1">{day.day}</div>
                    {day.date && (
                      <div className="text-xs text-gray-500 mb-2">{day.date}</div>
                    )}
                    <div className="flex justify-center mb-3 text-gray-600">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{Math.round(day.high_temp)}°</span>
                        <span className="text-gray-600">{Math.round(day.low_temp)}°</span>
                      </div>
                      {day.precipitation_chance > 0 && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          <Droplets className="w-3 h-3 mr-1" />
                          {day.precipitation_chance}%
                        </Badge>
                      )}
                      {day.wind_speed && (
                        <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                          <Wind className="w-3 h-3" />
                          {day.wind_speed} m/s
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-4">
                {Array(7).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weather Tips */}
        <Card className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-700">🌿 Weather-Based Farming Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">Watering Guidelines</h4>
                <p className="text-emerald-700">
                  {weatherData?.humidity > 70 
                    ? "High humidity - reduce watering frequency"
                    : weatherData?.humidity < 40
                    ? "Low humidity - increase watering and consider mulching"
                    : "Moderate humidity - maintain regular watering schedule"
                  }
                </p>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">Pest Risk</h4>
                <p className="text-emerald-700">
                  {weatherData?.temperature > 25 && weatherData?.humidity > 60
                    ? "High temperature and humidity - increased pest activity expected"
                    : weatherData?.temperature < 10
                    ? "Low temperature - reduced pest activity"
                    : "Moderate conditions - normal pest monitoring recommended"
                  }
                </p>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">Field Work</h4>
                <p className="text-emerald-700">
                  {weatherData?.wind_speed > 15
                    ? "High winds - avoid spraying and be cautious with tall crops"
                    : weatherData?.visibility < 5
                    ? "Low visibility - limit field operations"
                    : "Good conditions for most field activities"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}