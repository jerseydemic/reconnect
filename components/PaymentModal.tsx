"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Lock, Loader2 } from "lucide-react";
import { upgradeToPremium } from "@/lib/utils";

interface PaymentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    sessionId: string;
}

export function PaymentModal({ open, onClose, onSuccess, sessionId }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mark session as paid
        upgradeToPremium(sessionId);
        
        setIsProcessing(false);
        setShowSuccess(true);

        // Call success callback after showing success message
        setTimeout(() => {
            onSuccess();
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl">
                        Unlock Your Personalized Healing Plan
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Get access to your customized relationship healing tasks
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Features List */}
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium">18 Personalized Healing Tasks</p>
                                <p className="text-sm text-gray-600">Tailored to your specific relationship needs</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium">Progress Tracking</p>
                                <p className="text-sm text-gray-600">Monitor your healing journey over time</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium">Expert Guidance</p>
                                <p className="text-sm text-gray-600">Research-backed relationship improvement strategies</p>
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 text-center border border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">One-time payment</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            $3.99
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Lifetime access to your results</p>
                    </div>

                    {/* CTA Button */}
                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5 mr-2" />
                                Unlock for $3.99
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                        Secure payment processing • Cancel anytime
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
