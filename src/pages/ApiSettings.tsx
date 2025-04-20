
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Key, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ApiSettings = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Load saved API key on component mount
    const savedApiKey = localStorage.getItem("openrouter_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const testOpenRouterConnection = async (key: string): Promise<boolean> => {
    setIsTestingConnection(true);
    setConnectionStatus("Testing connection...");

    try {
      // Make a simple request to OpenRouter to check if API key is valid
      const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setConnectionStatus("Connection successful");
        return true;
      } else {
        const data = await response.json();
        setConnectionStatus(`Connection failed: ${data.error || "Invalid API key"}`);
        return false;
      }
    } catch (error) {
      setConnectionStatus("Connection failed: Network error");
      return false;
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Test the connection before saving
    const isConnectionSuccessful = await testOpenRouterConnection(apiKey);
    
    if (isConnectionSuccessful) {
      // Store API key in localStorage
      localStorage.setItem("openrouter_api_key", apiKey);
      
      toast({
        title: "API Key Saved",
        description: "Your OpenRouter API key has been saved successfully and connection is verified.",
      });
    } else {
      toast({
        title: "Warning",
        description: "Connection test failed, but your API key has been saved. Please verify the key is correct.",
        variant: "destructive",
      });
      // Still save the key even if connection test fails
      localStorage.setItem("openrouter_api_key", apiKey);
    }
    
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
          API Configuration
        </h1>
        
        <Card className="w-full mb-6 border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              OpenRouter API Configuration
            </CardTitle>
            <CardDescription>
              Connect to OpenRouter to enable AI-powered compliance checking and risk management features.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="api-key" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  OpenRouter API Key
                </label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your OpenRouter API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your API key is stored securely in your browser and used only for processing your compliance documents.
                </p>
                
                {connectionStatus && (
                  <div className={`mt-2 text-sm ${
                    connectionStatus === "Connection successful" 
                      ? "text-green-600 flex items-center" 
                      : connectionStatus === "Testing connection..." 
                        ? "text-gray-600"
                        : "text-red-600"
                  }`}>
                    {connectionStatus === "Connection successful" && <CheckCircle className="h-4 w-4 mr-1" />}
                    {connectionStatus}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveApiKey} 
                  disabled={isSaving || isTestingConnection || !apiKey.trim()}
                >
                  {isSaving || isTestingConnection ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isSaving ? "Saving..." : "Testing Connection..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save & Test API Key
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>API Usage Information</CardTitle>
            <CardDescription>
              Learn how CompliAI uses the OpenRouter API to provide compliance features.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="font-semibold mb-2">What is OpenRouter?</h3>
                <p className="text-sm">
                  OpenRouter is a service that provides access to various AI models. CompliAI uses these models for compliance scanning, gap analysis, and risk assessment.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">How We Use Your API Key</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Document compliance scanning (GDPR, CCPA, HIPAA, etc.)</li>
                  <li>Automated regulatory gap analysis</li>
                  <li>Vendor contract risk assessment</li>
                  <li>Generating compliance reports and recommendations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Data Privacy</h3>
                <p className="text-sm">
                  Documents you upload for compliance checking are processed using your API key. We do not store the content of your documents on our servers beyond the duration necessary for processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiSettings;
