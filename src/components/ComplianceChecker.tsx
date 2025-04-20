
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSearch, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import ComplianceResult from "./ComplianceResult";

type Regulation = "gdpr" | "ccpa" | "hipaa" | "iso27001";

type ComplianceReport = {
  score: number;
  issues: Array<{
    severity: "high" | "medium" | "low";
    description: string;
    recommendation: string;
  }>;
  summary: string;
  timestamp: string;
};

const ComplianceChecker = () => {
  const [documentText, setDocumentText] = useState<string>("");
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [apiKeyExists, setApiKeyExists] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const apiKey = localStorage.getItem("openai_api_key");
    setApiKeyExists(!!apiKey);
  }, []);

  // Real-time analysis when text or regulations change
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (documentText.trim() && regulations.length > 0 && apiKeyExists) {
        checkCompliance();
      }
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [documentText, regulations]);

  const handleRegulationToggle = (regulation: Regulation) => {
    setRegulations(prev => 
      prev.includes(regulation) 
        ? prev.filter(r => r !== regulation) 
        : [...prev, regulation]
    );
  };

  const checkCompliance = async () => {
    if (!documentText.trim()) {
      toast({
        title: "Error",
        description: "Please enter document text to check for compliance",
        variant: "destructive",
      });
      return;
    }

    if (regulations.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one regulation to check against",
        variant: "destructive",
      });
      return;
    }

    const apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenAI API key in the settings",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: `You are a compliance expert. Analyze the following document for compliance with ${regulations.join(", ")} regulations. Provide a detailed analysis with specific issues, their severity, and recommendations for changes. Format your response as JSON with the following structure: { score: number, issues: Array<{ severity: "high" | "medium" | "low", description: string, recommendation: string }>, summary: string }`
            },
            {
              role: "user",
              content: documentText
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }

      const data = await response.json();
      let parsedAnalysis;
      
      try {
        // The OpenAI response comes wrapped in content, and may include markdown code blocks
        const content = data.choices[0].message.content;
        
        // Check if the response is wrapped in markdown code blocks and extract the JSON
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        
        parsedAnalysis = JSON.parse(jsonString);
      } catch (e) {
        console.error("Failed to parse OpenAI response", e);
        throw new Error('Invalid response format');
      }

      const mockReport: ComplianceReport = {
        ...parsedAnalysis,
        timestamp: new Date().toISOString(),
      };
      
      setReport(mockReport);
      
      toast({
        title: "Analysis Complete",
        description: `Compliance score: ${mockReport.score}%. ${mockReport.issues.length} issues found.`,
      });
    } catch (error) {
      console.error("Error during compliance check:", error);
      toast({
        title: "Error",
        description: "Failed to process compliance check. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    const reportText = `
CompliAI Compliance Report
Generated: ${new Date(report.timestamp).toLocaleString()}
Compliance Score: ${report.score}%

Summary:
${report.summary}

Issues Found:
${report.issues.map(issue => `
Severity: ${issue.severity.toUpperCase()}
Description: ${issue.description}
Recommendation: ${issue.recommendation}
`).join('\n')}

Regulations Checked:
${regulations.map(r => r.toUpperCase()).join(', ')}
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Your compliance report has been downloaded successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FileSearch className="mr-2 h-5 w-5" />
              Document Analysis
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter document text to check for compliance:
                </label>
                <Textarea
                  placeholder="Paste your document text here..."
                  className="min-h-[200px]"
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select regulations to check against:
                </label>
                <div className="space-y-2">
                  {[
                    { id: "gdpr", label: "GDPR (General Data Protection Regulation)" },
                    { id: "ccpa", label: "CCPA (California Consumer Privacy Act)" },
                    { id: "hipaa", label: "HIPAA (Health Insurance Portability and Accountability Act)" },
                    { id: "iso27001", label: "ISO 27001 (Information Security Management)" }
                  ].map(regulation => (
                    <div key={regulation.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={regulation.id} 
                        checked={regulations.includes(regulation.id as Regulation)}
                        onCheckedChange={() => handleRegulationToggle(regulation.id as Regulation)}
                      />
                      <label htmlFor={regulation.id} className="text-sm font-medium">
                        {regulation.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {!apiKeyExists && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-700 mb-2">
                    API key required for compliance checking
                  </p>
                  <Link to="/api-settings">
                    <Button variant="outline" size="sm" className="w-full">
                      Configure API Key
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {report && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Analysis Results
              </h3>
              <ComplianceResult report={report} onDownload={downloadReport} />
            </CardContent>
          </Card>
        )}

        {!report && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Analysis Results
              </h3>
              {isChecking ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="text-sm text-gray-600">Analyzing document...</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <FileSearch className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-2">
                    No analysis results yet
                  </p>
                  <p className="text-sm text-gray-400">
                    Enter your document text and select regulations to start the analysis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ComplianceChecker;
