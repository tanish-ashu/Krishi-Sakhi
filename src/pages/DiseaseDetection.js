import React, { useState, useRef } from "react";
import { DiseaseDetection } from "../entities/all";
import { UploadFile, InvokeLLM } from "../integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Leaf,
  Bug,
  Zap
} from "lucide-react";

export default function DiseaseDetectionPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setAnalysisResult(null);
      setError(null);
    } else {
      setError("Please select a valid image file");
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Upload the image
      const { file_url } = await UploadFile({ file: selectedImage });

      // Analyze the image with AI
      const analysisData = await InvokeLLM({
        prompt: `Analyze this plant image for diseases, pests, or health issues. Provide detailed analysis including:
        - Detected disease or issue (if any)
        - Plant type identification
        - Confidence level (0-100)
        - Visible symptoms
        - Treatment recommendations
        - Prevention tips
        - Severity assessment
        Be very thorough and provide practical farming advice.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            detected_disease: { type: "string" },
            plant_type: { type: "string" },
            confidence_score: { type: "number" },
            symptoms: { 
              type: "array",
              items: { type: "string" }
            },
            treatment_recommendations: {
              type: "array", 
              items: { type: "string" }
            },
            prevention_tips: {
              type: "array",
              items: { type: "string" }
            },
            severity: { 
              type: "string",
              enum: ["low", "moderate", "high", "critical"]
            },
            is_healthy: { type: "boolean" }
          }
        }
      });

      // Save to database
      const detectionRecord = await DiseaseDetection.create({
        image_url: file_url,
        detected_disease: analysisData.detected_disease,
        confidence_score: analysisData.confidence_score,
        symptoms: analysisData.symptoms,
        treatment_recommendations: analysisData.treatment_recommendations,
        plant_type: analysisData.plant_type,
        severity: analysisData.severity,
        prevention_tips: analysisData.prevention_tips
      });

      setAnalysisResult({ ...analysisData, image_url: file_url });

    } catch (error) {
      console.error("Analysis error:", error);
      setError("Failed to analyze the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const startNewAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">
            🔍 Plant Disease Detection
          </h1>
          <p className="text-emerald-600 text-lg">
            Upload a photo of your plant to get instant AI-powered diagnosis
          </p>
        </div>

        {!selectedImage && !analysisResult && (
          <Card className="border-2 border-dashed border-emerald-200 bg-emerald-50/30">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-10 h-10 text-emerald-600" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select Plant Image
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Choose a clear photo of your plant showing any concerning areas
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => fileInputRef.current.click()}
                    className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload from Gallery
                  </Button>
                  
                  <Button 
                    onClick={() => cameraInputRef.current.click()}
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedImage && !analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                Selected Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected plant"
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Analyze Plant
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={startNewAnalysis}
                    variant="outline"
                    disabled={isAnalyzing}
                  >
                    Choose Different Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {analysisResult.is_healthy ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Bug className="w-5 h-5 text-red-600" />
                  )}
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={analysisResult.image_url}
                      alt="Analyzed plant"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Plant Identification</h4>
                      <p className="text-gray-700">{analysisResult.plant_type}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Detected Issue</h4>
                      <p className="text-gray-700 mb-2">{analysisResult.detected_disease}</p>
                      <div className="flex gap-2">
                        <Badge 
                          variant="outline" 
                          className={getSeverityColor(analysisResult.severity)}
                        >
                          {analysisResult.severity} severity
                        </Badge>
                        <Badge variant="outline">
                          {analysisResult.confidence_score}% confidence
                        </Badge>
                      </div>
                    </div>

                    {analysisResult.symptoms && analysisResult.symptoms.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Symptoms Identified</h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {analysisResult.symptoms.map((symptom, index) => (
                            <li key={index}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {analysisResult.treatment_recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">💊 Treatment Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisResult.treatment_recommendations.map((treatment, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800">{treatment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisResult.prevention_tips && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">🛡️ Prevention Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisResult.prevention_tips.map((tip, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-800">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-center">
              <Button
                onClick={startNewAnalysis}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Analyze Another Plant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}