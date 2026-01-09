"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSessionsByEmail, validateEmail } from "@/lib/utils";
import { Session } from "@/lib/types";
import { Heart, Calendar, Users, ArrowRight } from "lucide-react";

export default function MySessionsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!email.trim() || !validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const userSessions = getSessionsByEmail(email);
    setSessions(userSessions);
    setSearched(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSessionProgress = (session: Session) => {
    const totalQuestions = 30;
    const answered = session.partner1Answers.length;
    return Math.round((answered / totalQuestions) * 100);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ReConnect
            </h1>
          </div>
          <p className="text-lg text-gray-700">My Sessions</p>
        </div>

        {/* Search Card */}
        <Card className="shadow-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Find Your Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!email.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Find My Sessions
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>

        {/* Sessions List */}
        {searched && (
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <Card className="shadow-xl">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">
                    No sessions found for this email address.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Make sure you entered the same email you used when creating your session.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Your Sessions ({sessions.length})
                </h2>
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    className="shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                    onClick={() => {
                      const partner = session.sessionType === "solo" ? "solo" : "1";
                      router.push(`/session/${session.id}?partner=${partner}`);
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {session.sessionType === "couple" ? (
                              <Users className="w-5 h-5 text-purple-500" />
                            ) : (
                              <Heart className="w-5 h-5 text-pink-500" />
                            )}
                            <h3 className="text-lg font-bold text-gray-800">
                              {session.sessionType === "couple"
                                ? "Couple Assessment"
                                : "Solo Assessment"}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {session.partner1Name}
                            {session.sessionType === "couple" &&
                              session.partner2Name &&
                              ` & ${session.partner2Name}`}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(session.createdAt)}
                            </div>
                            <div>
                              {session.completed ? (
                                <span className="text-green-600 font-medium">
                                  ✓ Completed
                                </span>
                              ) : (
                                <span className="text-orange-600 font-medium">
                                  {getSessionProgress(session)}% Complete
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
