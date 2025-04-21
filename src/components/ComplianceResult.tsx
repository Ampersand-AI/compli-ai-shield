
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, Download, FileText, ArrowLeft, Eye, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ComplianceResultProps {
  report: {
    score: number;
    issues: Array<{
      severity: "high" | "medium" | "low";
      description: string;
      recommendation: string;
    }>;
    summary: string;
    timestamp: string;
  };
  onDownload: () => void;
}

const ComplianceResult = ({ report, onDownload }: ComplianceResultProps) => {
  const [view, setView] = useState<"analysis" | "suggestions">("analysis");
  const { toast } = useToast();
  const isPassing = report.score >= 70;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Suggestion copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      {view === "analysis" ? (
        <>
          <Alert variant={isPassing ? "default" : "destructive"} className="border-2">
            <div className="flex items-center gap-2">
              {isPassing ? (
                <Check className="h-5 w-5 text-gray-900 dark:text-white" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
              <div>
                <AlertTitle className="text-lg font-semibold">
                  {isPassing ? "Compliance Check Passed" : "Compliance Issues Detected"}
                </AlertTitle>
                <AlertDescription className="text-base">
                  Overall compliance score: <span className="font-semibold">{report.score}%</span>
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <Card className="shadow-sm border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center text-xl">
                <FileText className="mr-2 h-5 w-5" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableHead className="w-[100px] font-semibold">Severity</TableHead>
                      <TableHead className="font-semibold">Issue</TableHead>
                      <TableHead className="font-semibold">Required Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.issues.map((issue, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <Badge variant={getSeverityColor(issue.severity)} className="text-xs font-semibold">
                            {issue.severity.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{issue.description}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {issue.recommendation}
                        </TableCell>
                      </TableRow>
                    ))}
                    {report.issues.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                          No compliance issues detected
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 border-t pt-4 dark:border-gray-800 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analysis timestamp: {new Date(report.timestamp).toLocaleString()}
                </p>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => setView("suggestions")}
                    variant="default"
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Show Suggestions
                  </Button>
                  <Button onClick={onDownload} variant="outline" className="flex-1 border-gray-300 dark:border-gray-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        // Suggestions Section
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("analysis")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Analysis
              </Button>
              <h4 className="text-lg font-semibold">Compliance Suggestions</h4>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[500px]">
              {report.issues.map((issue, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={getSeverityColor(issue.severity)}>
                      {issue.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Non-Compliant Area:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {issue.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Suggested Change:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(issue.recommendation)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {issue.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplianceResult;
