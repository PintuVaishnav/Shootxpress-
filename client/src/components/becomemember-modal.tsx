"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

interface MemberData {
    fullName: string;
    gender: string;
    email: string;
    whatsapp: string;
    address: string;
    profileLink: string;
    portfolio: string;
    iphone: string;
    instantReel: string;
    otherPlatform: string;
    hasVehicle: string;
    dressCode: string;
    reason: string;
}

export default function BecomeMemberModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState<MemberData>({
        fullName: "",
        gender: "",
        email: "",
        whatsapp: "",
        address: "",
        profileLink: "",
        portfolio: "",
        iphone: "",
        instantReel: "",
        otherPlatform: "",
        hasVehicle: "",
        dressCode: "",
        reason: "",
    });

    // Open modal on event
    useEffect(() => {
        const openModal = () => setIsOpen(true);
        window.addEventListener("openMemberModal", openModal);
        return () => window.removeEventListener("openMemberModal", openModal);
    }, []);

    // Disable scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    const handleInput = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const closeModal = () => setIsOpen(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        emailjs
            .send(
                import.meta.env.VITE_EMAIL_SERVICE_ID,
                import.meta.env.VITE_MEMBER_TEMPLATE_ID,
                formData,
                import.meta.env.VITE_EMAIL_PUBLIC_KEY
            )
            .then(() => {
                toast({
                    title: "Application Submitted",
                    description: "Your application has been successfully submitted.",
                });
                setFormData({
                    fullName: "",
                    gender: "",
                    email: "",
                    whatsapp: "",
                    address: "",
                    profileLink: "",
                    portfolio: "",
                    iphone: "",
                    instantReel: "",
                    otherPlatform: "",
                    hasVehicle: "",
                    dressCode: "",
                    reason: "",
                });
                closeModal();
            })
            .catch(() => {
                toast({
                    title: "Error",
                    description: "Failed to submit application. Please try again.",
                    variant: "destructive",
                });
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4">
            <div className="fixed inset-0 bg-black/50" onClick={closeModal}></div>

            <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto p-8 z-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-black text-foreground">Become a Member</h2>
                    <Button variant="ghost" size="icon" onClick={closeModal}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Full Name *" value={formData.fullName} onChange={(v) => handleInput("fullName", v)} required />
                    <SelectField label="Gender *" value={formData.gender} onChange={(v) => handleInput("gender", v)} options={["male", "female", "other"]} required />
                    <InputField label="Email Address *" type="email" value={formData.email} onChange={(v) => handleInput("email", v)} required />
                    <InputField label="WhatsApp Number *" value={formData.whatsapp} onChange={(v) => handleInput("whatsapp", v)} required />
                    <InputField label="Current Address *" value={formData.address} onChange={(v) => handleInput("address", v)} required />
                    <InputField label="Instagram / Drive / Reel Link *" value={formData.profileLink} onChange={(v) => handleInput("profileLink", v)} required />
                    <InputField label="Portfolio *" value={formData.portfolio} onChange={(v) => handleInput("portfolio", v)} required />
                    <InputField label="Which iPhone do you use?" value={formData.iphone} onChange={(v) => handleInput("iphone", v)} />
                    <SelectField label="Have you created or edited Instant Reels before?" value={formData.instantReel} onChange={(v) => handleInput("instantReel", v)} options={["yes", "no"]} />
                    <InputField label="Other Instant Reel Platforms" value={formData.otherPlatform} onChange={(v) => handleInput("otherPlatform", v)} />
                    <SelectField label="Do you own a vehicle for travel?" value={formData.hasVehicle} onChange={(v) => handleInput("hasVehicle", v)} options={["yes", "no"]} />
                    <SelectField label="Can you follow the dress code (ID/T-shirt)?" value={formData.dressCode} onChange={(v) => handleInput("dressCode", v)} options={["yes", "no"]} />
                    <TextareaField label="Why do you want to join ShootXPress? *" value={formData.reason} onChange={(v) => handleInput("reason", v)} required />
                    <Button type="submit" className="w-full mt-2">Submit Application</Button>
                </form>
            </div>
        </div>
    );
}

// Reusable input components
const InputField = ({ label, value, onChange, type = "text", required = false }) => (
    <div>
        <Label>{label}</Label>
        <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} required={required} />
    </div>
);

const TextareaField = ({ label, value, onChange, required = false }) => (
    <div>
        <Label>{label}</Label>
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
);

const SelectField = ({ label, value, onChange, options, required = false }) => (
    <div>
        <Label>{label}</Label>
        <Select value={value} onValueChange={onChange} required={required}>
            <SelectTrigger>
                <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
                {options.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);
