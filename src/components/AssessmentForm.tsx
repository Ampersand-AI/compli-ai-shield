
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

type RegulationType = "gdpr" | "ccpa" | "hipaa" | "iso27001";

const AssessmentForm = () => {
  const [step, setStep] = useState<number>(1);
  const [regulations, setRegulations] = useState<RegulationType[]>([]);
  const [dataHandlingInfo, setDataHandlingInfo] = useState<string>("");
  const [securityMeasures, setSecurityMeasures] = useState<string>("");
  const [vendorInfo, setVendorInfo] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const { toast } = useToast();

  const totalSteps = 5;

  const handleRegulationToggle = (regulation: RegulationType) => {
    setRegulations(prev => 
      prev.includes(regulation) 
        ? prev.filter(r => r !== regulation) 
        : [...prev, regulation]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCompleted(true);
      toast({
        title: "Assessment Complete",
        description: "Your compliance assessment has been successfully submitted. We'll generate your report shortly.",
      });
    }, 2000);
  };

  if (completed) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Assessment Completed!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              We're analyzing your responses and will prepare a detailed compliance report. You'll receive it shortly.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-md w-full max-w-md mb-6">
              <p className="font-medium mb-2">Assessment Summary:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Applicable regulations: {regulations.length ? regulations.map(r => r.toUpperCase()).join(", ") : "None selected"}</li>
                <li>Data handling details provided: {dataHandlingInfo ? "Yes" : "No"}</li>
                <li>Security measures details provided: {securityMeasures ? "Yes" : "No"}</li>
                <li>Vendor management information provided: {vendorInfo ? "Yes" : "No"}</li>
              </ul>
            </div>
            <Button>View Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="pt-6">
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Tell us about your business</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Let's start by understanding which regulations are most relevant to your organization.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="gdpr" 
                    checked={regulations.includes("gdpr")}
                    onCheckedChange={() => handleRegulationToggle("gdpr")}
                  />
                  <label htmlFor="gdpr" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    GDPR (General Data Protection Regulation)
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ccpa" 
                    checked={regulations.includes("ccpa")}
                    onCheckedChange={() => handleRegulationToggle("ccpa")}
                  />
                  <label htmlFor="ccpa" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    CCPA (California Consumer Privacy Act)
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hipaa" 
                    checked={regulations.includes("hipaa")}
                    onCheckedChange={() => handleRegulationToggle("hipaa")}
                  />
                  <label htmlFor="hipaa" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    HIPAA (Health Insurance Portability and Accountability Act)
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="iso27001" 
                    checked={regulations.includes("iso27001")}
                    onCheckedChange={() => handleRegulationToggle("iso27001")}
                  />
                  <label htmlFor="iso27001" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    ISO 27001 (Information Security Management)
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Data Handling Procedures</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please describe how your organization collects, processes, and stores user data.
              </p>
              <Textarea 
                placeholder="Describe your data handling procedures..." 
                className="min-h-[150px]"
                value={dataHandlingInfo}
                onChange={(e) => setDataHandlingInfo(e.target.value)}
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Security Measures</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Tell us about the security measures your organization has implemented to protect sensitive data.
              </p>
              <Textarea 
                placeholder="Describe your security measures..." 
                className="min-h-[150px]"
                value={securityMeasures}
                onChange={(e) => setSecurityMeasures(e.target.value)}
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Vendor Management</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please provide information about how you manage vendor relationships and evaluate vendor compliance.
              </p>
              <Textarea 
                placeholder="Describe your vendor management process..." 
                className="min-h-[150px]"
                value={vendorInfo}
                onChange={(e) => setVendorInfo(e.target.value)}
              />
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please review your responses before submitting the assessment.
              </p>
              
              <Tabs defaultValue="regulations" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="regulations" className="flex-1">Regulations</TabsTrigger>
                  <TabsTrigger value="data-handling" className="flex-1">Data Handling</TabsTrigger>
                  <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
                  <TabsTrigger value="vendors" className="flex-1">Vendors</TabsTrigger>
                </TabsList>
                
                <TabsContent value="regulations" className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md mt-2">
                  <h4 className="font-semibold mb-2">Applicable Regulations:</h4>
                  {regulations.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {regulations.map(reg => (
                        <li key={reg} className="capitalize">{reg.toUpperCase()}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No regulations selected</p>
                  )}
                </TabsContent>
                
                <TabsContent value="data-handling" className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md mt-2">
                  <h4 className="font-semibold mb-2">Data Handling:</h4>
                  {dataHandlingInfo ? (
                    <p className="text-sm">{dataHandlingInfo}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No information provided</p>
                  )}
                </TabsContent>
                
                <TabsContent value="security" className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md mt-2">
                  <h4 className="font-semibold mb-2">Security Measures:</h4>
                  {securityMeasures ? (
                    <p className="text-sm">{securityMeasures}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No information provided</p>
                  )}
                </TabsContent>
                
                <TabsContent value="vendors" className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md mt-2">
                  <h4 className="font-semibold mb-2">Vendor Management:</h4>
                  {vendorInfo ? (
                    <p className="text-sm">{vendorInfo}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No information provided</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : step < totalSteps ? (
                <span className="flex items-center">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              ) : (
                "Submit Assessment"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentForm;
