"use client";

import { Clipboard, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import Spline from "@splinetool/react-spline";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-16 p-10">
      {/* Top Section: Title & Spline Scene */}
      <div className="grid grid-cols-2 gap-7 w-full max-w-[80vw] h-[60vh] items-center ">
        {/* Left: Title Section */}
        <div className="text-left ">
          <p className="text-3xl text-gray-500">Welcome to</p>
          <h1 className="text-9xl pb-5 font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            MedAssign
          </h1>
          <p className="text-xl mt-10 max-w-3xl text-gray-600">
            A cutting-edge staff scheduling platform designed for
            medical professionals. It helps streamline shift assignments while
            considering staff preferences, ensuring a balanced and efficient
            workforce.
          </p>

        </div>

        {/* Right: Spline Scene & Buttons */}
        <div className="flex flex-col items-center space-y-0 w-full h-[60vh] ">
          <Spline scene="https://prod.spline.design/F1D6Clc08jBAivZ9/scene.splinecode" />
          <div className="flex flex-col items-center space-y-4 w-2/3 ">
            <Link href="/schedule">
              <button className="py-4 w-[20vw] bg-blue-600 text-white rounded-xl text-2xl font-semibold hover:bg-blue-950 transition">
                Generate Schedule
              </button>
            </Link>
            <Link href="/staff">
              <button className="py-4 w-[20vw] bg-gray-700 text-white rounded-xl text-2xl font-semibold hover:bg-gray-900 transition">
                View Staff
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-30 text-center py-16">
        <div className="space-y-4">
          <Clipboard className="w-20 h-20 text-blue-500 mx-auto" />
          <h3 className="font-bold text-4xl">Step 1</h3>
          <p className="text-gray-600 text-2xl">Enter staff preferences</p>
        </div>
        <div className="space-y-4">
          <Clock className="w-20 h-20 text-indigo-500 mx-auto" />
          <h3 className="font-bold text-4xl">Step 2</h3>
          <p className="text-gray-600 text-2xl">Generate optimal schedule</p>
        </div>
        <div className="space-y-4">
          <CheckCircle className="w-20 h-20 text-purple-600 mx-auto" />
          <h3 className="font-bold text-4xl">Step 3</h3>
          <p className="text-gray-600 text-2xl">View & save schedule</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-3xl">
        <h2 className="text-4xl font-bold text-center mb-5">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="what-is-medassign">
            <AccordionTrigger className="text-xl">What is MedAssign?</AccordionTrigger>
            <AccordionContent className="text-lg">
              MedAssign is a scheduling tool that automates shift assignments
              while taking staff preferences into account.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how-does-it-work">
            <AccordionTrigger className="text-xl">
              How does MedAssign generate schedules?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
            MedAssign uses a sophisticated, two-stage approach. 
            First, it leverages the optimization capabilities of Google's OR-Tools 
            to solve hard scheduling constraints, ensuring all mandatory requirements are met. 
            Then, it employs a Taboo Search algorithm to optimize soft constraints, such as staff 
            preferences and fairness considerations, resulting in a balanced and efficient schedule.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="can-i-edit-schedules">
            <AccordionTrigger className="text-xl">
              Can I manually adjust schedules?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
            Not currently! Our development team is actively working on 
            implementing a comprehensive schedule customization feature, 
            and we anticipate it will be available in a future update.           
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
