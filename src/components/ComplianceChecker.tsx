import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSearch, Calendar, FileText, Upload } from "lucide-react";
import ComplianceResult from "./ComplianceResult";
import OpenAI from "openai";

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
    setRegulations((prev) =>
      prev.includes(regulation)
        ? prev.filter((r) => r !== regulation)
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

    setIsChecking(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error("OpenRouter API key is not configured");
      }

      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
        defaultHeaders: {
          "HTTP-Referer": window.location.origin,
          "X-Title": "CompliAI Shield",
        },
      });

      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "system",
            content: `You are a seasoned compliance and regulatory expert specializing in global frameworks such as ${regulations.join(
              ", "
            )}. Your task is to evaluate the user's document for alignment with these regulations.

Analyze the document thoroughly, identify potential compliance issues, and assess their severity. Provide clear, actionable recommendations for each issue. Your tone should be professional, concise, and supportive—focused on guiding businesses toward compliance without alarmism.

Respond in JSON format with the following structure:
{
  score: number (from 0 to 100, representing estimated compliance),
  issues: Array<{
    severity: "high" | "medium" | "low",
    description: string,
    recommendation: string
  }>,
  summary: string (a concise overview of key findings and overall compliance posture)
}

Avoid hallucinating or making assumptions not based on the text. If specific required sections or disclosures are missing, flag them as issues.

Only return the JSON object. Do not include any additional commentary or explanation.`,
          },
          {
            role: "user",
            content: documentText,
          },
        ],
        temperature: 0.4,
      });

      let parsedAnalysis;

      try {
        const content = completion.choices[0].message.content;

        // Check if the response is wrapped in markdown code blocks and extract the JSON
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;

        parsedAnalysis = JSON.parse(jsonString);
      } catch (e) {
        console.error("Failed to parse response", e);
        throw new Error("Invalid response format");
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
        description:
          error instanceof Error
            ? error.message
            : "Failed to process compliance check. Please try again.",
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
${report.issues
  .map(
    (issue) => `
Severity: ${issue.severity.toUpperCase()}
Description: ${issue.description}
Recommendation: ${issue.recommendation}
`
  )
  .join("\n")}

Regulations Checked:
${regulations.map((r) => r.toUpperCase()).join(", ")}
    `;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-report-${
      new Date().toISOString().split("T")[0]
    }.txt`;
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
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-6 h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FileSearch className="mr-2 h-5 w-5" />
              Document Analysis
            </h3>
            
            <div className="flex-1 flex flex-col min-h-[500px]">
              <div className="flex-1 relative">
                <label className="block text-sm font-medium mb-2">
                  Enter document text to check for compliance:
                </label>
                <Textarea
                  className="h-full min-h-[300px] border-gray-300 dark:border-gray-700 resize-none"
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                />
                {!documentText && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center justify-center space-y-2 bg-white dark:bg-gray-900 p-4 rounded-lg">
                      <Upload className="h-12 w-12 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Paste your document text here
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
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

              <Button 
                onClick={checkCompliance}
                className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                disabled={isChecking || !documentText.trim() || regulations.length === 0}
              >
                {isChecking ? "Analyzing Document..." : "Start Analysis"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {report ? (
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Analysis Results
              </h3>
              <ComplianceResult report={report} onDownload={downloadReport} />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Analysis Results
              </h3>
              {isChecking ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Analyzing document...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <FileSearch className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    No analysis results yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Enter your document text and select regulations to start the
                    analysis
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
