import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Sparkles, Zap, Rocket } from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

const Index = () => {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Handle hash-based navigation
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="space-y-32 py-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 relative">
      <div className="inset-0 absolute flex h-[500px] w-full items-center justify-center overflow-visible rounded-lg p-20">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
    </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>AI-Powered Compliance Analysis</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 [text-shadow:_0_2px_10px_rgba(255,255,255,0.5)] dark:[text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]">
            Streamline Your Compliance Process
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 [text-shadow:_0_1px_5px_rgba(255,255,255,0.3)] dark:[text-shadow:_0_1px_5px_rgba(0,0,0,0.3)]">
            Get instant analysis and recommendations for your documents with our advanced AI technology.
          </p>
          <div className="flex justify-center space-x-4">
            {user ? (
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Zap className="w-4 h-4 mr-2" />
                Start Analysis
              </Button>
            ) : (
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Rocket className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-600 dark:text-gray-300">Everything you need to ensure compliance</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-100/20 dark:bg-blue-900/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">AI-Powered Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our advanced AI technology analyzes your documents for compliance with various regulations.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-green-100/20 dark:bg-green-900/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Real-time Results</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get instant feedback and recommendations for your compliance documents.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-purple-100/20 dark:bg-purple-900/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Multiple Regulations</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Support for various compliance frameworks and regulations.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Benefits</h2>
          <p className="text-gray-600 dark:text-gray-300">Why choose CompliShield</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Reduce manual compliance checking time by up to 90%.
                </p>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reduce Risk</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Minimize compliance risks with thorough AI analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 dark:text-gray-300">Trusted by compliance professionals worldwide</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-500">Compliance Officer</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              "CompliShield has revolutionized our compliance process. The AI analysis is incredibly accurate."
            </p>
          </div>
          <div className="p-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
              <div>
                <p className="font-semibold">Jane Smith</p>
                <p className="text-sm text-gray-500">Legal Director</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              "The time saved on compliance checks is remarkable. Highly recommended!"
            </p>
          </div>
          <div className="p-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
              <div>
                <p className="font-semibold">Mike Johnson</p>
                <p className="text-sm text-gray-500">Risk Manager</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              "An essential tool for any organization dealing with compliance."
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 dark:text-gray-300">Choose the plan that's right for you</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-4">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>5 documents per month</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>Basic compliance checks</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>Email support</span>
              </li>
            </ul>
            <Button className="w-full">Get Started</Button>
          </div>
          <div className="p-8 rounded-xl bg-white dark:bg-gray-900 border-2 border-blue-500 shadow-lg relative flex flex-col h-full">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm">
              Popular
            </div>
            <h3 className="text-xl font-semibold mb-4">Plus</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$14</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>50 documents per month</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>Advanced compliance checks</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>Custom compliance frameworks</span>
              </li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              Get Started
            </Button>
          </div>
          <div className="p-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-4">Ultra</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>Unlimited documents</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>Advanced compliance checks</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>24/7 Priority support</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>Custom compliance frameworks</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>API access</span>
              </li>
            </ul>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
