
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSearch, Download, FileX, Calendar, Bell } from "lucide-react";

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
  const { toast } = useToast();

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

    const apiKey = localStorage.getItem("openrouter_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenRouter API key in the settings",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    
    // In a real implementation, this would make an API call to OpenRouter
    // Simulating API call for demonstration purposes
    setTimeout(() => {
      const mockReport: ComplianceReport = {
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        issues: [
          {
            severity: "high",
            description: "Missing explicit user consent for data collection",
            recommendation: "Add clear consent mechanisms before collecting user data"
          },
          {
            severity: "medium",
            description: "Unclear data retention policy",
            recommendation: "Specify how long user data is retained and why"
          },
          {
            severity: "low",
            description: "Privacy policy lacks contact information",
            recommendation: "Add DPO contact details to privacy policy"
          }
        ],
        summary: "This document generally follows compliance guidelines but requires specific updates to meet all regulatory requirements. Key issues include consent mechanisms, retention policies, and contact information.",
        timestamp: new Date().toISOString(),
      };
      
      setReport(mockReport);
      setIsChecking(false);
      
      toast({
        title: "Compliance Check Complete",
        description: `Compliance score: ${mockReport.score}%. ${mockReport.issues.length} issues found.`,
      });
    }, 3000);
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
        <Card>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="gdpr" 
                      checked={regulations.includes("gdpr")}
                      onCheckedChange={() => handleRegulationToggle("gdpr")}
                    />
                    <label htmlFor="gdpr" className="text-sm font-medium">
                      GDPR (General Data Protection Regulation)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ccpa" 
                      checked={regulations.includes("ccpa")}
                      onCheckedChange={() => handleRegulationToggle("ccpa")}
                    />
                    <label htmlFor="ccpa" className="text-sm font-medium">
                      CCPA (California Consumer Privacy Act)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hipaa" 
                      checked={regulations.includes("hipaa")}
                      onCheckedChange={() => handleRegulationToggle("hipaa")}
                    />
                    <label htmlFor="hipaa" className="text-sm font-medium">
                      HIPAA (Health Insurance Portability and Accountability Act)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="iso27001" 
                      checked={regulations.includes("iso27001")}
                      onCheckedChange={() => handleRegulationToggle("iso27001")}
                    />
                    <label htmlFor="iso27001" className="text-sm font-medium">
                      ISO 27001 (Information Security Management)
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <Button 
                  onClick={checkCompliance} 
                  disabled={isChecking}
                  className="w-full"
                >
                  {isChecking ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking Compliance...
                    </>
                  ) : (
                    "Check Compliance"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              {report ? (
                <Bell className="mr-2 h-5 w-5" />
              ) : (
                <FileX className="mr-2 h-5 w-5" />
              )}
              {report ? "Compliance Report" : "No Report Generated Yet"}
            </h3>
            
            {report ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-xs text-gray-500">
                      {new Date(report.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.score >= 90 
                      ? "bg-green-100 text-green-800" 
                      : report.score >= 70 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-red-100 text-red-800"
                  }`}>
                    Score: {report.score}%
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Summary</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {report.summary}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Issues Found ({report.issues.length})</h4>
                  <div className="space-y-2">
                    {report.issues.map((issue, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className={`text-xs font-semibold inline-block px-2 py-1 rounded-full mb-2 ${
                          issue.severity === "high" 
                            ? "bg-red-100 text-red-800" 
                            : issue.severity === "medium" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-blue-100 text-blue-800"
                        }`}>
                          {issue.severity.toUpperCase()}
                        </div>
                        <p className="text-sm font-medium">{issue.description}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          <strong>Recommendation:</strong> {issue.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={downloadReport} 
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <FileX className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No compliance report generated yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Enter your document text and check compliance to generate a report
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceChecker;
