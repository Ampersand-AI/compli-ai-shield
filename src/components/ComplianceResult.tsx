
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, Download, FileText } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

        <div className="mt-6 border-t pt-4 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Analysis timestamp: {new Date(report.timestamp).toLocaleString()}
          </p>
          <Button onClick={onDownload} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Full Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceResult;
