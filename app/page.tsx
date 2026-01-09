"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Users, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateSessionId, saveSession, validateEmail, hashPassword } from "@/lib/utils";
import { Session } from "@/lib/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  generateVerificationCode, 
  sendVerificationCode, 
  storeVerificationCode, 
  verifyCode, 
  clearVerificationCode,
  findSessionByEmail,
  resetSessionPassword 
} from "@/lib/password-reset";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"start" | "create" | "join" | "solo" | "forgot-password">("start");
  const [partner1Name, setPartner1Name] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  // Demographics
  const [gender, setGender] = useState<"male" | "female" | "non-binary" | "prefer-not-to-say" | "">("" );
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  // Forgot password state
  const [resetEmail, setResetEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetStep, setResetStep] = useState<"email" | "code" | "password">("email");
  const [resetSessionId, setResetSessionId] = useState<string | null>(null);

  const handleCreateSession = async () => {
    if (!partner1Name.trim() || !userEmail.trim() || !password.trim() || !confirmPassword.trim()) return;
    if (!validateEmail(userEmail)) {
      alert("Please enter a valid email address");
      return;
    }
    if (password.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (age && (parseInt(age) < 18 || parseInt(age) > 120)) {
      alert("Please enter a valid age (18-120)");
      return;
    }

    const passwordHash = await hashPassword(password);
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
      createdAt: new Date().toISOString(),
      userEmail: userEmail.trim().toLowerCase(),
      passwordHash,
      gender: gender || undefined,
      age: age ? parseInt(age) : undefined,
      location: location.trim() || undefined,
    };

    saveSession(newSession);
    // Partner 1 starts their assessment immediately
    router.push(`/session/${sessionId}?partner=1`);
  };

  const handleCreateSoloSession = async () => {
    if (!partner1Name.trim() || !userEmail.trim() || !password.trim() || !confirmPassword.trim()) return;
    if (!validateEmail(userEmail)) {
      alert("Please enter a valid email address");
      return;
    }
    if (password.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (age && (parseInt(age) < 18 || parseInt(age) > 120)) {
      alert("Please enter a valid age (18-120)");
      return;
    }

    const passwordHash = await hashPassword(password);
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
      createdAt: new Date().toISOString(),
      userEmail: userEmail.trim().toLowerCase(),
      passwordHash,
      gender: gender || undefined,
      age: age ? parseInt(age) : undefined,
      location: location.trim() || undefined,
    };

    saveSession(newSession);
    router.push(`/session/${sessionId}?partner=solo`);
  };

  const handleJoinSession = () => {
    if (!sessionCode.trim()) return;
    router.push(`/session/${sessionCode.toUpperCase()}?partner=2`);
  };

  const handleRequestResetCode = () => {
    if (!resetEmail.trim()) return;
    if (!validateEmail(resetEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    // Find session by email
    const sessionId = findSessionByEmail(resetEmail);
    if (!sessionId) {
      alert("No account found with this email address");
      return;
    }

    // Generate and send verification code
    const code = generateVerificationCode();
    storeVerificationCode(resetEmail, code);
    sendVerificationCode(resetEmail, code);
    
    setResetSessionId(sessionId);
    setResetStep("code");
  };

  const handleVerifyCode = () => {
    if (!verificationCode.trim()) return;

    if (verifyCode(resetEmail, verificationCode)) {
      setResetStep("password");
    } else {
      alert("Invalid or expired verification code");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmNewPassword.trim()) return;
    
    if (newPassword.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!resetSessionId) return;

    const success = await resetSessionPassword(resetSessionId, newPassword);
    if (success) {
      clearVerificationCode(resetEmail);
      alert("Password reset successfully! You can now log in with your new password.");
      // Reset state and go back to start
      setMode("start");
      setResetEmail("");
      setVerificationCode("");
      setNewPassword("");
      setConfirmNewPassword("");
      setResetStep("email");
      setResetSessionId(null);
    } else {
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 relative">
            <Heart className="w-12 h-12 text-pink-500 fill-pink-500 dark:text-pink-400 dark:fill-pink-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
              ReConnect
            </h1>
            <div className="absolute right-0">
              <ThemeToggle />
            </div>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Heal your relationship, one swipe at a time
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {mode === "start" && "Choose Your Assessment"}
              {mode === "create" && "Couple Assessment"}
              {mode === "join" && "Join Session"}
              {mode === "solo" && "Solo Assessment"}
              {mode === "forgot-password" && resetStep === "email" && "Forgot Password"}
              {mode === "forgot-password" && resetStep === "code" && "Enter Verification Code"}
              {mode === "forgot-password" && resetStep === "password" && "Reset Password"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === "start" && (
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-600 font-medium">How would you like to assess your relationship?</p>
                </div>
                
                <Button
                  onClick={() => setMode("create")}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 h-16 text-lg"
                >
                  <Users className="mr-2 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-bold">Couple Assessment</div>
                    <div className="text-xs opacity-90">Work together with your partner</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => setMode("solo")}
                  variant="outline"
                  className="w-full h-16 text-lg border-2 border-purple-300 hover:bg-purple-50"
                >
                  <Heart className="mr-2 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-bold">Solo Assessment</div>
                    <div className="text-xs opacity-75">Reflect on your own</div>
                  </div>
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">or</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => setMode("join")}
                  variant="outline"
                  className="w-full h-12 text-base"
                >
                  Join Partner's Session
                </Button>
                
                <Button
                  onClick={() => router.push("/my-sessions")}
                  variant="ghost"
                  className="w-full text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  Continue Previous Session
                </Button>

                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    <strong>For separated married couples</strong>
                    <br />
                    Identify areas for healing and reconnection
                  </p>
                </div>
              </>
            )}

            {mode === "create" && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name</label>
                    <Input
                      placeholder="Enter your name"
                      value={partner1Name}
                      onChange={(e) => setPartner1Name(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">We'll use this to save your session</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      placeholder="Create a password (min 4 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Protects your session from unauthorized access</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleCreateSession()}
                    />
                  </div>
                  
                  {/* Demographics Section */}
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-3">Optional: Help us personalize your experience</p>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Gender</label>
                        <select
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          value={gender}
                          onChange={(e) => setGender(e.target.value as any)}
                        >
                          <option value="">Prefer not to say</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Age</label>
                        <Input
                          type="number"
                          placeholder="Your age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          min="18"
                          max="120"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Location</label>
                        <Input
                          placeholder="City, State or Country"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleCreateSession}
                  disabled={!partner1Name.trim() || !userEmail.trim() || !password.trim()}
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name</label>
                    <Input
                      placeholder="Enter your name"
                      value={partner1Name}
                      onChange={(e) => setPartner1Name(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">We'll use this to save your session</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      placeholder="Create a password (min 4 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Protects your session from unauthorized access</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  {/* Demographics Section */}
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-3">Optional: Help us personalize your experience</p>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Gender</label>
                        <select
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          value={gender}
                          onChange={(e) => setGender(e.target.value as any)}
                        >
                          <option value="">Prefer not to say</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Age</label>
                        <Input
                          type="number"
                          placeholder="Your age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          min="18"
                          max="120"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Location</label>
                        <Input
                          placeholder="City, State or Country"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleCreateSoloSession()}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-600">
                  <p>
                    <strong>Solo Mode:</strong> Reflect on your relationship independently.
                    You'll answer questions about how you feel and receive personalized tasks.
                  </p>
                </div>
                <Button
                  onClick={handleCreateSoloSession}
                  disabled={!partner1Name.trim() || !userEmail.trim() || !password.trim()}
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
        
        <div className="mt-4 flex justify-center">
          <a
            href="https://instagram.com/kingdemic"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            Contact: @kingdemic
          </a>
        </div>
      </div>
    </main>
  );
}
