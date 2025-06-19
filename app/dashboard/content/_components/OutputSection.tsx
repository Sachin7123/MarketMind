import React, { useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface PROPS {
  aiOutput: string;
}

const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

function OutputSection({ aiOutput }: PROPS) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    editorInstance?.setMarkdown(aiOutput);
  }, [aiOutput]);
  return (
    <div className="bg-white shadow-lg border rounded-lg">
      <div className="flex justify-between items-center p-5">
        <h2 className="text-2xl font-bold">Your Result</h2>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex gap-2"
          onClick={() => navigator.clipboard.writeText(aiOutput)}
        >
          <Copy className="w-4 h-4" /> Copy
        </Button>
      </div>
      <ToastEditor
        ref={editorRef}
        initialValue="Your Result will be displayed here"
        initialEditType="markdown"
        height="600px"
        useCommandShortcut={true}
        onChange={() =>
          console.log(editorRef.current?.getInstance().getMarkdown())
        }
      />
    </div>
  );
}

export default OutputSection;
