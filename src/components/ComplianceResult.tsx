
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, Download, FileText, Eye, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const [showSuggestions, setShowSuggestions] = useState(false);
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
      <Alert variant={isPassing ? "default" : "destructive"}>
        <div className="flex items-center gap-2">
          {isPassing ? (
            <Check className="h-5 w-5 text-gray-900" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <div>
            <AlertTitle>
              {isPassing ? "Compliance Check Passed" : "Compliance Issues Detected"}
            </AlertTitle>
            <AlertDescription>
              Overall compliance score: {report.score}%
            </AlertDescription>
          </div>
        </div>
      </Alert>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Detailed Analysis
        </h3>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Severity</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Required Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.issues.map((issue, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant={getSeverityColor(issue.severity)}>
                    {issue.severity.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{issue.description}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {issue.recommendation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 border-t pt-4 dark:border-gray-800 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Analysis timestamp: {new Date(report.timestamp).toLocaleString()}
          </p>

          <div className="flex space-x-4">
            <Button
              onClick={() => setShowSuggestions(!showSuggestions)}
              variant="outline"
              className="flex-1"
            >
              <Eye className="mr-2 h-4 w-4" />
              {showSuggestions ? "Hide Suggestions" : "View Suggestions"}
            </Button>
            <Button onClick={onDownload} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Full Report
            </Button>
          </div>
        </div>
      </div>

      {showSuggestions && (
        <Card className="border-gray-200 shadow-sm mt-6">
          <CardContent className="pt-6">
            <h4 className="text-lg font-semibold mb-4">Compliance Suggestions</h4>
            <div className="space-y-4">
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
