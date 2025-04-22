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
        return {
          variant: "destructive",
          className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
        };
      case "medium":
        return {
          variant: "secondary",
          className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
        };
      default:
        return {
          variant: "outline",
          className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) {
      return "text-green-600 dark:text-green-400";
    } else if (score >= 50) {
      return "text-yellow-600 dark:text-yellow-400";
    } else {
      return "text-red-600 dark:text-red-400";
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
      <div className="min-h-[600px]">
        {view === "analysis" ? (
          <>
            <Alert variant={isPassing ? "default" : "destructive"} className="border-2">
              <div className="flex items-center gap-2">
                {isPassing ? (
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <div>
                  <AlertTitle className="text-lg font-semibold">
                    {isPassing ? "Compliance Check Passed" : "Compliance Issues Detected"}
                  </AlertTitle>
                  <AlertDescription className="text-base">
                    Overall compliance score:{" "}
                    <span className={`font-semibold ${getScoreColor(report.score)}`}>
                      {report.score}%
                    </span>
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            <Card className="p-0 border-0 shadow-none h-[calc(600px-4rem)]">
              <CardContent className="pt-4 px-0 pb-0 shadow-none h-full flex flex-col">
                <div className="rounded-md border flex-1 flex flex-col overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800/50">
                        <TableRow>
                          <TableHead className="w-[120px] font-semibold">Severity</TableHead>
                          <TableHead className="font-semibold">Issue</TableHead>
                          <TableHead className="font-semibold w-[40%]">Required Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="overflow-y-auto">
                        {report.issues.map((issue, index) => {
                          const severityStyle = getSeverityColor(issue.severity);
                          return (
                            <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <TableCell className="w-[120px]">
                                <Badge 
                                  variant={severityStyle.variant as any} 
                                  className={`text-xs font-semibold ${severityStyle.className}`}
                                >
                                  {issue.severity.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                {issue.description}
                              </TableCell>
                              <TableCell className="w-[40%] text-gray-600 dark:text-gray-400">
                                {issue.recommendation}
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
          <Card className="p-0 shadow-none border-0 h-[calc(600px)]">
            <CardContent className="pt-6 px-0 pb-0 shadow-none h-full flex flex-col">
              <div className="flex items-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView("analysis")}
                  className="mr-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h4 className="text-lg font-semibold">Compliance Suggestions</h4>
              </div>
              <div className="space-y-4 overflow-y-auto flex-1">
                {report.issues.map((issue, index) => {
                  const severityStyle = getSeverityColor(issue.severity);
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={severityStyle.variant as any}
                          className={`${severityStyle.className}`}
                        >
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
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ComplianceResult;
