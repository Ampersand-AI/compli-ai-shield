
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, Download } from "lucide-react";
import { Button } from "./ui/button";

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

  return (
    <div className="space-y-4">
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

      <div className="space-y-4">
        {report.issues.map((issue, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  issue.severity === "high"
                    ? "destructive"
                    : issue.severity === "medium"
                    ? "secondary"
                    : "outline"
                }
              >
                {issue.severity.toUpperCase()} RISK
              </Badge>
            </div>
            <p className="font-medium text-gray-900">{issue.description}</p>
            <p className="text-sm text-gray-600">{issue.recommendation}</p>
          </div>
        ))}
      </div>

      <Button onClick={onDownload} className="w-full mt-4" variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download Full Report
      </Button>
    </div>
  );
};

export default ComplianceResult;
