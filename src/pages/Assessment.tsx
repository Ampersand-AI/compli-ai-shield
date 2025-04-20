
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Assessment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
          Compliance Assessment
        </h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Our AI-powered assessment will help identify potential compliance gaps in your organization's policies and procedures. The assessment typically takes 10-15 minutes to complete.
          </p>
          
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-md">
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
            
            <Button size="lg" className="w-full sm:w-auto">
              Begin Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
