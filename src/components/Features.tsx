
import { 
  Search, 
  FileCheck, 
  Bell, 
  FileWarning 
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    name: "AI-Powered Gap Analysis",
    description: "Automatically scan your company documents and systems against regulations like GDPR, CCPA, and HIPAA to proactively identify compliance gaps.",
    icon: Search,
  },
  {
    name: "Automated Evidence Collection",
    description: "Save hundreds of hours with AI-driven evidence gathering and audit-ready report generation.",
    icon: FileCheck,
  },
  {
    name: "Real-time Regulatory Monitoring",
    description: "Stay ahead with AI that continuously monitors and alerts you to relevant regulatory changes affecting your business.",
    icon: Bell,
  },
  {
    name: "Vendor Risk Analysis",
    description: "Instantly analyze third-party contracts to identify compliance risks and problematic clauses in your supply chain.",
    icon: FileWarning,
  },
];

export const Features = () => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Compliance Confidence, Powered by AI
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Transform your compliance from a burden into a competitive advantage with our
            AI-powered platform.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.name} className="group relative overflow-hidden transition-all hover:shadow-lg">
              <div className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
