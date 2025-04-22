import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { Link } from "react-router-dom";
import AssessmentForm from "@/components/AssessmentForm";
import ComplianceChecker from "@/components/ComplianceChecker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Assessment = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full">
        {/* <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Compliance Assessment
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
            Our AI-powered assessment will help identify potential compliance gaps in your organization's policies and procedures. The assessment typically takes 10-15 minutes to complete.
          </p>
          
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What to expect:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Questions about your current compliance practices</li>
                <li>Review of your data handling procedures</li>
                <li>Analysis of your security measures</li>
                <li>Evaluation of vendor management processes</li>
              </ul>
            </div>
          </div>
        </div> */}
        
        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="assessment" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
              Assessment Questionnaire
            </TabsTrigger>
            <TabsTrigger value="compliance-check" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
              Document Compliance Check
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assessment">
            <AssessmentForm />
          </TabsContent>
          
          <TabsContent value="compliance-check">
            <ComplianceChecker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Assessment;
