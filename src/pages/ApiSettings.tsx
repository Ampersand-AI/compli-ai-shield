
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Key } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ApiSettings = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Store API key in localStorage (for demo purposes)
      localStorage.setItem("openrouter_api_key", apiKey);
      
      setIsSaving(false);
      toast({
        title: "API Key Saved",
        description: "Your OpenRouter API key has been saved successfully.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
          API Configuration
        </h1>
        
        <Card className="w-full mb-6">
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
                  Your API key is stored securely and used only for processing your compliance documents.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveApiKey} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save API Key
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
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
