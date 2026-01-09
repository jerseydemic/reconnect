"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateSessionId, saveSession } from "@/lib/utils";
import { Session } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"start" | "create" | "join" | "solo">("start");
  const [partner1Name, setPartner1Name] = useState("");
  const [sessionCode, setSessionCode] = useState("");

  const handleCreateSession = () => {
    if (!partner1Name.trim()) return;

    const sessionId = generateSessionId();
    const newSession: Session = {
      id: sessionId,
      sessionType: "couple",
      partner1Name: partner1Name.trim(),
      partner2Name: "",
      partner1Answers: [],
      partner2Answers: [],
      currentQuestionIndex: 0,
      completed: false,
      paid: false,
      subscriptionTier: "free",
      taskProgress: {},
      createdAt: new Date().toISOString()
    };

    saveSession(newSession);
    router.push(`/session/${sessionId}?partner=1`);
  };

  const handleCreateSoloSession = () => {
    if (!partner1Name.trim()) return;

    const sessionId = generateSessionId();
    const newSession: Session = {
      id: sessionId,
      sessionType: "solo",
      partner1Name: partner1Name.trim(),
      partner2Name: "Solo Assessment",
      partner1Answers: [],
      partner2Answers: [],
      currentQuestionIndex: 0,
      completed: false,
      paid: false,
      subscriptionTier: "free",
      taskProgress: {},
      createdAt: new Date().toISOString()
    };

    saveSession(newSession);
    router.push(`/session/${sessionId}?partner=solo`);
  };

  const handleJoinSession = () => {
    if (!sessionCode.trim()) return;
    router.push(`/session/${sessionCode.toUpperCase()}?partner=2`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ReConnect
            </h1>
          </div>
          <p className="text-lg text-gray-700">
            Heal your relationship, one swipe at a time
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {mode === "start" && "Get Started"}
              {mode === "create" && "Create Session"}
              {mode === "join" && "Join Session"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === "start" && (
              <>
                <Button
                  onClick={() => setMode("create")}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 h-14 text-lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Start with Partner
                </Button>
                <Button
                  onClick={() => setMode("solo")}
                  variant="outline"
                  className="w-full h-14 text-lg border-2 border-purple-300 hover:bg-purple-50"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Solo Assessment
                </Button>
                <Button
                  onClick={() => setMode("join")}
                  variant="outline"
                  className="w-full h-14 text-lg"
                >
                  Join Partner's Session
                </Button>

                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    <strong>For separated married couples</strong>
                    <br />
                    Work together or reflect solo to identify areas for healing
                  </p>
                </div>
              </>
            )}

            {mode === "create" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={partner1Name}
                    onChange={(e) => setPartner1Name(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCreateSession()}
                  />
                </div>
                <Button
                  onClick={handleCreateSession}
                  disabled={!partner1Name.trim()}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  Create Couple Session
                </Button>
                <Button
                  onClick={() => setMode("start")}
                  variant="ghost"
                  className="w-full"
                >
                  Back
                </Button>
              </>
            )}

            {mode === "solo" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={partner1Name}
                    onChange={(e) => setPartner1Name(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCreateSoloSession()}
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-600">
                  <p>
                    <strong>Solo Mode:</strong> Reflect on your relationship independently.
                    You'll answer questions about how you feel and receive personalized tasks.
                  </p>
                </div>
                <Button
                  onClick={handleCreateSoloSession}
                  disabled={!partner1Name.trim()}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  Start Solo Assessment
                </Button>
                <Button
                  onClick={() => setMode("start")}
                  variant="ghost"
                  className="w-full"
                >
                  Back
                </Button>
              </>
            )}

            {mode === "join" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Code</label>
                  <Input
                    placeholder="Enter 6-character code"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === "Enter" && handleJoinSession()}
                    maxLength={6}
                  />
                </div>
                <Button
                  onClick={handleJoinSession}
                  disabled={sessionCode.length !== 6}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  Join Session
                </Button>
                <Button
                  onClick={() => setMode("start")}
                  variant="ghost"
                  className="w-full"
                >
                  Back
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Not a substitute for professional therapy
        </p>
      </div>
    </main>
  );
}
