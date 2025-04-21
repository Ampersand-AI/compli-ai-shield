
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, Clipboard, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const formSchema = z.object({
  organization: z.string().min(1, { message: "Organization name is required" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  hasPolicies: z.enum(["yes", "no", "partial"], { 
    required_error: "Please select an option" 
  }),
  policyDescription: z.string().optional(),
  dataHandling: z.enum(["yes", "no", "unsure"], { 
    required_error: "Please select an option" 
  }),
  securityMeasures: z.string().min(1, { message: "Please describe your security measures" }),
  vendorManagement: z.enum(["yes", "no", "partial"], { 
    required_error: "Please select an option" 
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AssessmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);
  const { toast } = useToast();
  const [apiKeyExists, setApiKeyExists] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "",
      industry: "",
      hasPolicies: "no",
      policyDescription: "",
      dataHandling: "unsure",
      securityMeasures: "",
      vendorManagement: "no",
    },
  });

  // Check if OpenAI API key exists
  useEffect(() => {
    const apiKey = localStorage.getItem("openai_api_key");
    setApiKeyExists(!!apiKey);
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!apiKeyExists) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenAI API key in the settings",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const apiKey = localStorage.getItem("openai_api_key");
      
      const prompt = `
        I need a compliance assessment for the following organization:
        
        Organization Name: ${data.organization}
        Industry: ${data.industry}
        
        Compliance Information:
        - Has formal compliance policies: ${data.hasPolicies}
        ${data.policyDescription ? `- Policy description: ${data.policyDescription}` : ''}
        - Data handling procedures: ${data.dataHandling}
        - Security measures: ${data.securityMeasures}
        - Vendor management procedures: ${data.vendorManagement}
        
        Please provide:
        1. An overall risk assessment score (0-100%)
        2. Key compliance gaps identified
        3. Recommended actions to improve compliance
        4. Timeline suggestions for implementation
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a compliance expert. Provide detailed compliance assessments for organizations based on the information provided."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate assessment');
      }

      const responseData = await response.json();
      const assessment = responseData.choices[0].message.content;
      
      setAssessmentResult(assessment);
      
      toast({
        title: "Assessment Complete",
        description: "Your compliance assessment has been generated successfully",
      });
    } catch (error) {
      console.error("Error during assessment:", error);
      toast({
        title: "Error",
        description: "Failed to generate assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (assessmentResult) {
      navigator.clipboard.writeText(assessmentResult);
      toast({
        description: "Assessment copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-8">
      {!assessmentResult ? (
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-6">Compliance Questionnaire</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your organization name" className="border-gray-300 dark:border-gray-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Healthcare, Finance, Technology" className="border-gray-300 dark:border-gray-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="hasPolicies"
                  render={({ field }) => (
                    <FormItem className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                      <FormLabel className="text-base">Does your organization have formal compliance policies?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 mt-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes, comprehensive policies</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="partial" />
                            </FormControl>
                            <FormLabel className="font-normal">Partial policies</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No formal policies</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("hasPolicies") !== "no" && (
                  <FormField
                    control={form.control}
                    name="policyDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Briefly describe your compliance policies</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your current compliance policies..." 
                            className="min-h-[100px] border-gray-300 dark:border-gray-700" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="dataHandling"
                  render={({ field }) => (
                    <FormItem className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                      <FormLabel className="text-base">Do you have documented data handling procedures?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 mt-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes, fully documented</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No documentation</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="unsure" />
                            </FormControl>
                            <FormLabel className="font-normal">Unsure</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="securityMeasures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe your security measures</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your current security measures..." 
                          className="min-h-[100px] border-gray-300 dark:border-gray-700" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vendorManagement"
                  render={({ field }) => (
                    <FormItem className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                      <FormLabel className="text-base">Do you have vendor management processes in place?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 mt-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes, comprehensive</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="partial" />
                            </FormControl>
                            <FormLabel className="font-normal">Partial processes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No formal processes</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {!apiKeyExists ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      API key required for assessment
                    </p>
                    <Link to="/api-settings">
                      <Button variant="outline" size="sm" className="w-full border-gray-300 dark:border-gray-700">
                        Configure API Key
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-800 dark:hover:bg-gray-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Generating Assessment..." : "Submit Assessment"}
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Assessment Results
                </h3>
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="border-gray-300 dark:border-gray-700">
                  <Clipboard className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              
              <div className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm max-h-[500px] overflow-y-auto">
                {assessmentResult}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => setAssessmentResult(null)}
                  className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Complete Another Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm h-full">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Compliance Recommendations</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md h-[calc(100%-2rem)] overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Based on your assessment, we've prepared personalized recommendations for improving your compliance posture. These recommendations are based on industry best practices and regulatory requirements.
                </p>
                <ul className="mt-4 space-y-4">
                  <li className="p-3 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold">Review your policies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Based on your assessment, we recommend reviewing your current policies to ensure they are comprehensive and up-to-date with the latest regulations.
                    </p>
                  </li>
                  <li className="p-3 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold">Enhance data handling procedures</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Consider implementing more robust data handling procedures to better protect sensitive information and comply with privacy regulations.
                    </p>
                  </li>
                  <li className="p-3 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold">Schedule regular assessments</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      We recommend conducting regular compliance assessments to ensure ongoing compliance with changing regulations and industry standards.
                    </p>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;
