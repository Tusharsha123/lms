import React from "react";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with coding",
      features: [
        "Access to 5 free courses",
        "Basic code execution (50 runs/month)",
        "Community forum access",
        "Progress tracking",
        "Mobile app access",
      ],
      buttonText: "Get Started",
      buttonVariant: "secondary",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Full access to all courses and premium features",
      features: [
        "Unlimited access to all courses",
        "Unlimited code execution",
        "Download course materials",
        "Certificate of completion",
        "Priority support",
        "Advanced progress analytics",
        "Offline access",
        "Custom learning paths",
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "primary",
      popular: true,
    },
    {
      name: "Team",
      price: "$49",
      period: "per user/month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team management dashboard",
        "Custom branding",
        "Advanced analytics & reporting",
        "API access",
        "Priority phone support",
        "Custom integrations",
        "Bulk enrollment tools",
        "Dedicated account manager",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Choose Your Learning Journey
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock your coding potential with our comprehensive platform. Start
            free and upgrade as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular ? "border-blue-500 shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="mt-4 text-gray-600">{plan.description}</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    variant={plan.buttonVariant}
                    className="w-full"
                    size="lg"
                    fullWidth={true}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Can I switch plans anytime?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Do you offer refunds?
              </h3>
              <p className="mt-2 text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. No
                questions asked.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                What's included in the Team plan?
              </h3>
              <p className="mt-2 text-gray-600">
                The Team plan includes everything in Pro, plus advanced team
                management features, custom branding, detailed analytics, and
                priority support.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Can students get discounts?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes! Students with a valid student email get 50% off Pro and
                Team plans.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-blue-50 rounded-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Coding Journey?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of developers who are learning and growing with our
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                View Course Catalog
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
