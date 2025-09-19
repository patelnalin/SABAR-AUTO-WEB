
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LayoutGrid } from "lucide-react";

export default function LoginPage() {
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
            toast({
                title: "Invalid Mobile Number",
                description: "Please enter a valid 10-digit mobile number.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setIsOtpSent(true);
        toast({
            title: "OTP Sent",
            description: "An OTP has been sent to your mobile number. (Hint: 123456)",
        });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call to verify OTP
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock OTP check
        if (otp === "123456") {
            toast({
                title: "Login Successful",
                description: "Redirecting to your dashboard...",
            });
            router.push("/dashboard");
        } else {
            setIsLoading(false);
            toast({
                title: "Login Failed",
                description: "The OTP you entered is incorrect.",
                variant: "destructive",
            });
        }
    };

    return (
        <main className="relative flex items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
            <div className="absolute inset-0 z-0">
                 <Image 
                    src="https://images.unsplash.com/photo-1599827551820-99496e5733f1?q=80&w=2070&auto=format&fit=crop"
                    alt="Bajaj Auto Rickshaw"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="opacity-40"
                    data-ai-hint="auto rickshaw"
                />
            </div>
             <div className="relative z-10 w-full h-full flex items-center justify-start">
                 <Card 
                    data-state={isMounted ? 'open' : 'closed'}
                    className="w-full max-w-md mx-4 sm:mx-12 md:mx-24 lg:mx-32 bg-black/60 backdrop-blur-sm border-gray-700 text-white data-[state=open]:animate-slide-in-from-left"
                >
                    <CardHeader className="text-center">
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <LayoutGrid className="w-8 h-8 text-primary" />
                            <CardTitle className="text-3xl font-extrabold tracking-tight text-white">SABAR BAJAJ</CardTitle>
                        </div>
                        <CardDescription className="text-gray-300">Secure Admin Login</CardDescription>
                    </CardHeader>
                    <form onSubmit={isOtpSent ? handleLogin : handleSendOtp}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="mobile" className="text-gray-300">Mobile Number</Label>
                                <Input
                                    id="mobile"
                                    type="tel"
                                    placeholder="9876543210"
                                    required
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    disabled={isOtpSent || isLoading}
                                    maxLength={10}
                                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:ring-primary"
                                />
                            </div>
                            {isOtpSent && (
                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-gray-300">Enter OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        disabled={isLoading}
                                        maxLength={6}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:ring-primary"
                                    />
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isOtpSent ? "Login" : "Send OTP"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
             </div>
        </main>
    );
}
