/**
 * Premium Experience Drawer
 * Glass UI + Dynamic Tech Badges
 */

"use client";

import { useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { SecondaryButton } from "../secondary-button";
import { PrimaryButton } from "../primary-button";
import { generateColorFromString } from "@/lib/random-color";
import useResume from "@/hooks/resume/useResume";
import { ExperienceRequestBody } from "@/types/server-types/resume";



const jobTypes = [
    "Full-time",
    "Part-time",
    "Internship",
    "Contract",
    "Freelance",
    "Remote",
    "Hybrid",
    "On-site",
];

export default function ExperienceDrawer() {
    const INITIAL_FORM_DATA: ExperienceRequestBody = {
        jobRole: "",
        jobType: "",
        company: "",
        period: "",
        description: "",
        tech: [],
        order: 0,
    };

    const [formData, setFormData] = useState<ExperienceRequestBody>({
        ...INITIAL_FORM_DATA,
    });
    const [open, setOpen] = useState(false);
    const [techInput, setTechInput] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const addTech = (value: string) => {
        const newTechs = value
            .split(/[\s,]+/)
            .map((t) => t.trim())
            .filter(Boolean);

        setFormData((prev) => ({
            ...prev,
            tech: [...new Set([...prev.tech, ...newTechs])],
        }));
    };

    const removeTech = (tech: string) => {
        setFormData((prev) => ({
            ...prev,
            tech: prev.tech.filter((t) => t !== tech),
        }));
    };
    const { addExperience, loading, error } = useResume();

    const validateForm = (data: ExperienceRequestBody) => {
        if (!data.jobRole.trim()) return "Job role is required.";
        if (!data.jobType.trim()) return "Job type is required.";
        if (!data.company.trim()) return "Company is required.";
        if (!data.period.trim()) return "Period is required.";
        if (!data.description.trim()) return "Description is required.";
        if (!Number.isFinite(data.order) || data.order < 0) {
            return "Display order must be a non-negative number.";
        }
        return null;
    };

    const handleSubmit = async () => {
        if (loading) return;

        setFormError(null);

        const parsedTech = [
            ...new Set([
                ...formData.tech,
                ...techInput
                    .split(/[\s,]+/)
                    .map((t) => t.trim())
                    .filter(Boolean),
            ]),
        ];

        const payload: ExperienceRequestBody = {
            ...formData,
            jobRole: formData.jobRole.trim(),
            jobType: formData.jobType.trim(),
            company: formData.company.trim(),
            period: formData.period.trim(),
            description: formData.description.trim(),
            tech: parsedTech,
            order: Number.isFinite(formData.order) ? formData.order : 0,
        };

        const validationError = validateForm(payload);
        if (validationError) {
            setFormError(validationError);
            return;
        }

        const created = await addExperience(payload);
        if (!created) return;

        setFormData({ ...INITIAL_FORM_DATA });
        setTechInput("");
        setFormError(null);
        setOpen(false);
    };

    return (
        <Drawer
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                    setFormError(null);
                    setFormData({ ...INITIAL_FORM_DATA });
                    setTechInput("");
                }
            }}
        >
            <DrawerTrigger asChild>
                <SecondaryButton>
                    Add Experience +

                </SecondaryButton>
            </DrawerTrigger>

            <DrawerContent
                className="
    bg-background/95
    backdrop-blur-2xl
    border-t
    rounded-t-3xl
    shadow-2xl
    h-[90vh]
    flex flex-col">
                <DrawerHeader>
                    <DrawerTitle className="text-xl font-semibold tracking-tight">
                        Add Experience
                    </DrawerTitle>
                </DrawerHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex-1 overflow-y-auto px-6 pb-8"
                >
                    <div className="space-y-8">

                        {/* ===== BASIC INFO SECTION ===== */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Job Role */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Job Role <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        required
                                        placeholder="Senior Frontend Developer"
                                        className="h-11 rounded-lg bg-muted/40 border-border/60 focus-visible:ring-1"
                                        value={formData.jobRole}
                                        onChange={(e) =>
                                            setFormData({ ...formData, jobRole: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Job Type */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Job Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.jobType}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, jobType: value })
                                        }
                                    >
                                        <SelectTrigger className="h-11 rounded-lg bg-muted/40 border-border/60">
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border shadow-lg">
                                            {jobTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Company */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Company <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        required
                                        placeholder="Company name"
                                        className="h-11 rounded-lg bg-muted/40 border-border/60"
                                        value={formData.company}
                                        onChange={(e) =>
                                            setFormData({ ...formData, company: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Period */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Period <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        required
                                        placeholder="Jan 2023 - Present"
                                        className="h-11 rounded-lg bg-muted/40 border-border/60"
                                        value={formData.period}
                                        onChange={(e) =>
                                            setFormData({ ...formData, period: e.target.value })
                                        }
                                    />
                                </div>

                            </div>
                        </div>

                        {/* ===== DESCRIPTION SECTION ===== */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                Role Details
                            </h3>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Description <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    required
                                    rows={5}
                                    placeholder="Describe your measurable impact..."
                                    className="rounded-lg bg-muted/40 border-border/60 resize-none"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        {/* ===== TECH SECTION ===== */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                Technologies Used
                            </h3>

                            <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
                                <Input
                                    placeholder="Type and press space, comma or enter"
                                    className="h-11 rounded-lg bg-background border-border/60"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (["Enter", " ", ","].includes(e.key)) {
                                            e.preventDefault();
                                            if (techInput.trim()) {
                                                addTech(techInput);
                                                setTechInput("");
                                            }
                                        }
                                    }}
                                />

                                <div className="flex flex-wrap gap-2 min-h-6">
                                    {formData.tech.map((tech) => (
                                        <Badge
                                            key={tech}
                                            className="px-3 py-1 rounded-md text-xs flex items-center gap-1 text-white"
                                            style={{ backgroundColor: generateColorFromString(tech) }}
                                        >
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() => removeTech(tech)}
                                                className="ml-1 opacity-70 hover:opacity-100"
                                            >
                                                <X size={14} />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ===== ORDER SECTION ===== */}
                        <div className="space-y-2 max-w-xs">
                            <Label className="text-sm font-medium">
                                Display Order
                            </Label>
                            <Input
                                type="number"
                                min={0}
                                className="h-11 rounded-lg bg-muted/40 border-border/60"
                                value={formData.order}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        order: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                    </div>

                    {/* ===== FOOTER ACTION ===== */}
                    <div className="pt-8 border-t mt-8 flex flex-col items-center justify-center">
                        {(formError || error) && (
                            <p className="text-sm text-red-500 text-center mb-3 w-full">
                                {formError || error}
                            </p>
                        )}
                        <PrimaryButton type="submit" loading={loading} className="border-white border-2">
                            Save Experience

                        </PrimaryButton>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
