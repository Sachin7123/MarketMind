"use client";
import React, { useContext, useState } from "react";
import moment from "moment";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import Templates from "@/app/(data)/Templates";
import { TEMPLATE } from "../../_components/TemplateListSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generateContent } from "@/utils/AiModel";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface PROPS {
  params: {
    "template-slug": string;
  };
}

function CreateContent(props: PROPS) {
  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === props.params["template-slug"]
  );
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const { user } = useUser();
  const router = useRouter();
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const GenerateAIContent = async (formData: any) => {
    setLoading(true);
    if (totalUsage >= 10000) {
      setShowLimitDialog(true);
      setLoading(false);
      router.push("/dashboard/billing");
      return;
    }

    try {
      const selectedPrompt = selectedTemplate?.aiPrompt;
      const defaultFormatInstructions = `
Format the following content as a markdown document with:
- A main heading at the top
- Bold section titles
- Bullet points for outlines and sub-points
- Indentation for sub-bullets
- Use clear, readable structure
`;
      const finalAIPrompt = `${defaultFormatInstructions}\n\nContent: ${JSON.stringify(
        formData
      )}. ${selectedPrompt}`;
      const result = await generateContent(finalAIPrompt);
      setAiOutput(result);
      await SaveInDb(formData, selectedTemplate?.slug, result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const SaveInDb = async (formData: any, slug: any, aiResp: string) => {
    if (!formData || !slug || !user?.primaryEmailAddress?.emailAddress) return;

    const result = await db.insert(AIOutput).values({
      formData: JSON.stringify(formData),
      templateSlug: slug,
      aiResponse: aiResp,
      createdBy: user.primaryEmailAddress.emailAddress,
      createdAt: moment().format("DD/MM/yyyy"),
    });

    console.log(result);
  };

  return (
    <div className="p-10">
      <Link href="/dashboard">
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer">
          <ArrowLeft />
          Back
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
        <FormSection
          selectedTemplate={selectedTemplate}
          userFormInput={(v: any) => GenerateAIContent(v)}
          loading={loading}
        />
        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usage Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              You have used all your 10,000 available credits. Please upgrade
              your plan or contact support to continue using the AI features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLimitDialog(false)}>
              Close
            </AlertDialogCancel>
            {/* Optional upgrade button */}
            {/* <AlertDialogAction asChild>
        <Link href="/upgrade">Upgrade</Link>
      </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CreateContent;
