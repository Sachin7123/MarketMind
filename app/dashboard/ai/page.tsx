import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const metadata: Metadata = {
  title: "AI Tools",
  description: "Advanced AI-powered tools for content creation and analysis",
};

export default function AIToolsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Tools</h2>
      </div>
      <Tabs defaultValue="summarize" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summarize">Content Summarizer</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="chatbot">AI Chatbot</TabsTrigger>
          <TabsTrigger value="recommendations">
            Content Recommendations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="summarize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Summarizer</CardTitle>
              <CardDescription>
                Summarize long articles or content into concise points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your content here..."
                  className="min-h-[200px]"
                />
                <Button>Generate Summary</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>
                Analyze the sentiment of text content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter text to analyze sentiment..."
                  className="min-h-[200px]"
                />
                <Button>Analyze Sentiment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chatbot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Chatbot</CardTitle>
              <CardDescription>
                Chat with our AI assistant for help and support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[400px] border rounded-lg p-4 overflow-y-auto">
                  {/* Chat messages will appear here */}
                </div>
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button>Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Recommendations</CardTitle>
              <CardDescription>
                Get personalized content recommendations based on your interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Recommendation cards will appear here */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
