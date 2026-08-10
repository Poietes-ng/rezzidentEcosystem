import { useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "#/shared/components/ui/button";
import { Input } from "#/shared/components/ui/input";
import { StepProgress } from "#/shared/components/ui/step-progress";
import { FileUpload } from "#/shared/components/ui/file-upload";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "#/shared/components/ui/select";
import { StructureCard, STRUCTURE_SAMPLES } from "./StructureCard";

/* ── Types ── */

interface EstateFormData {
  estateName: string;
  estateAddress: string;
  stateLocated: string;
  levelStructure: string;
  estateStructure: string;
  stakeholder1Name: string;
  stakeholder1Phone: string;
  stakeholder1Email: string;
  stakeholder1Nin: File | null;
  stakeholder2Name: string;
  stakeholder2Phone: string;
  stakeholder2Email: string;
  stakeholder2Nin: File | null;
}

const INITIAL_FORM: EstateFormData = {
  estateName: "",
  estateAddress: "",
  stateLocated: "",
  levelStructure: "",
  estateStructure: "",
  stakeholder1Name: "",
  stakeholder1Phone: "",
  stakeholder1Email: "",
  stakeholder1Nin: null,
  stakeholder2Name: "",
  stakeholder2Phone: "",
  stakeholder2Email: "",
  stakeholder2Nin: null,
};

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const ESTATE_STRUCTURES = [
  "Residential Estate", "Gated Community", "Mixed-use Development",
  "Apartment Complex", "Townhouse Community", "Villa Compound",
];

/* ── Sub-step mapping to logical steps ── */

function subStepToLogical(sub: number): number {
  if (sub === 1) return 1;
  if (sub === 2 || sub === 3) return 2;
  return 3;
}

/* ── Animations ── */

const pageVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
};

/* ── Structure carousel ── */

const STRUCTURE_PAGES = [
  { structures: ["1-level", "2-level"] as const },
  { structures: ["3-level", "4-level"] as const },
];

/* ── Component ── */

export function RegistrationForm() {
  const navigate = useNavigate();
  const [subStep, setSubStep] = useState(1);
  const [form, setForm] = useState<EstateFormData>(INITIAL_FORM);
  const [structurePage, setStructurePage] = useState(0);

  const logicalStep = subStepToLogical(subStep);
  const totalLogicalSteps = 3;

  const updateField = useCallback(
    <K extends keyof EstateFormData>(key: K, value: EstateFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  function handleNext() {
    if (subStep < 4) {
      setSubStep((s) => s + 1);
    } else {
      navigate({ to: "/app/splash" });
    }
  }

  function handleBack() {
    if (subStep > 1) {
      setSubStep((s) => s - 1);
    } else {
      navigate({ to: "/registration-criteria" });
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* Go Back */}
      <button
        onClick={handleBack}
        className="mb-web-lg inline-flex items-center gap-1 self-start font-dmsans text-web-sm font-web-medium text-actionDark hover:opacity-70"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        Go Back
      </button>

      {/* Step Progress */}
      <StepProgress currentStep={logicalStep} totalSteps={totalLogicalSteps} className="mb-web-md" />

      {/* Dynamic form content */}
      <div>
        <AnimatePresence mode="wait">
          {/* ═══ SUB-STEP 1: Estate Details ═══ */}
          {subStep === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="enter" animate="center" exit="exit">
              <h1 className="mb-2 font-dmsans text-web-h3 font-web-bold text-actionDark">
                Fill in estate details
              </h1>
              <p className="mb-web-md font-dmsans text-web-sm text-gray-500 leading-relaxed">
                Provide your estate information below to get your community set up on Rezzident.
              </p>

              <div className="flex flex-col gap-web-md">
                {/* Estate Name */}
                <div>
                  <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                    Estate Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your estate name"
                    value={form.estateName}
                    onChange={(e) => updateField("estateName", e.target.value)}
                  />
                </div>

                {/* Estate Address */}
                <div>
                  <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                    Estate Address
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your estate address"
                    value={form.estateAddress}
                    onChange={(e) => updateField("estateAddress", e.target.value)}
                  />
                </div>

                {/* State Located */}
                <div>
                  <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                    State Located
                  </label>
                  <Select
                    value={form.stateLocated}
                    onValueChange={(val) => updateField("stateLocated", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ SUB-STEP 2: Structure Examples Carousel ═══ */}
          {subStep === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="enter" animate="center" exit="exit">
              <h1 className="mb-2 font-dmsans text-web-h3 font-web-bold text-actionDark">
                Naming structure
              </h1>
              <p className="mb-web-md font-dmsans text-web-sm text-gray-500 leading-relaxed">
                Define how streets, blocks, and units are labeled within your estate. Below are samples
                of some structures for a better understanding of how to create your estate structure.
              </p>

              {/* Structure examples */}
              <div className="flex flex-col gap-web-md">
                {STRUCTURE_PAGES[structurePage].structures.map((key) => {
                  const data = STRUCTURE_SAMPLES[key];
                  return (
                    <div key={key}>
                      <h3 className="mb-1 font-dmsans text-web-base font-web-bold text-actionDark">
                        {data.title}
                      </h3>
                      <p className="mb-3 font-dmsans text-web-xs text-gray-500">
                        {data.description}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {data.samples.map((sample, idx) => (
                          <StructureCard key={idx} sample={sample} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel dots + arrows */}
              <div className="mt-web-md flex items-center justify-center gap-4">
                <button
                  onClick={() => setStructurePage(Math.max(0, structurePage - 1))}
                  disabled={structurePage === 0}
                  className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-black/10 text-gray-400 hover:bg-gray-50 disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>

                <div className="flex gap-2">
                  {STRUCTURE_PAGES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setStructurePage(idx)}
                      className={`h-[8px] w-[8px] rounded-full transition-colors ${
                        structurePage === idx ? "bg-actionDark" : "bg-gray-300"
                      }`}
                      aria-label={`Page ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setStructurePage(Math.min(STRUCTURE_PAGES.length - 1, structurePage + 1))}
                  disabled={structurePage === STRUCTURE_PAGES.length - 1}
                  className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-black/10 text-gray-400 hover:bg-gray-50 disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ SUB-STEP 3: Structure Selection Form ═══ */}
          {subStep === 3 && (
            <motion.div key="step3" variants={pageVariants} initial="enter" animate="center" exit="exit">
              <h1 className="mb-2 font-dmsans text-web-h3 font-web-bold text-actionDark">
                Naming structure
              </h1>
              <p className="mb-web-md font-dmsans text-web-sm text-gray-500 leading-relaxed">
                Define how streets, blocks, and units are labeled within your estate.
              </p>

              <div className="flex flex-col gap-web-md">
                {/* Level Structure */}
                <div>
                  <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                    Level Structure
                  </label>
                  <Select
                    value={form.levelStructure}
                    onValueChange={(val) => updateField("levelStructure", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Level Structure</SelectItem>
                      <SelectItem value="2">2 Level Structure</SelectItem>
                      <SelectItem value="3">3 Level Structure</SelectItem>
                      <SelectItem value="4">4 Level Structure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Estate Structure */}
                <div>
                  <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                    Estate Structure
                  </label>
                  <Select
                    value={form.estateStructure}
                    onValueChange={(val) => updateField("estateStructure", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTATE_STRUCTURES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ SUB-STEP 4: Management Details ═══ */}
          {subStep === 4 && (
            <motion.div key="step4" variants={pageVariants} initial="enter" animate="center" exit="exit">
              <h1 className="mb-2 font-dmsans text-web-h3 font-web-bold text-actionDark">
                Management details
              </h1>
              <p className="mb-web-md font-dmsans text-web-sm text-gray-500 leading-relaxed">
                Enter the name, phone number, email address, and NIN of 2 key stakeholders
                responsible for managing this estate.
              </p>

              {/* Stakeholder 1 */}
              <div className="mb-web-md">
                <h3 className="mb-4 font-dmsans text-web-base font-web-bold text-actionDark">
                  Stakeholder 1
                </h3>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter stakeholder's full name"
                      value={form.stakeholder1Name}
                      onChange={(e) => updateField("stakeholder1Name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="Enter stakeholder's phone number"
                      value={form.stakeholder1Phone}
                      onChange={(e) => updateField("stakeholder1Phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter stakeholder's email address"
                      value={form.stakeholder1Email}
                      onChange={(e) => updateField("stakeholder1Email", e.target.value)}
                    />
                  </div>
                  <FileUpload
                    label="Upload NIN"
                    title="National Identification Number (NIN)"
                    description="Upload a clear image of your NIN slip or card for verification. PDF, JPG & PNG · Max 5MB"
                    value={form.stakeholder1Nin}
                    onChange={(file) => updateField("stakeholder1Nin", file)}
                  />
                </div>
              </div>

              {/* Stakeholder 2 */}
              <div>
                <h3 className="mb-4 font-dmsans text-web-base font-web-bold text-actionDark">
                  Stakeholder 2
                </h3>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter stakeholder's full name"
                      value={form.stakeholder2Name}
                      onChange={(e) => updateField("stakeholder2Name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="Enter stakeholder's phone number"
                      value={form.stakeholder2Phone}
                      onChange={(e) => updateField("stakeholder2Phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter stakeholder's email address"
                      value={form.stakeholder2Email}
                      onChange={(e) => updateField("stakeholder2Email", e.target.value)}
                    />
                  </div>
                  <FileUpload
                    label="Upload NIN"
                    title="National Identification Number (NIN)"
                    description="Upload a clear image of your NIN slip or card for verification. PDF, JPG & PNG · Max 5MB"
                    value={form.stakeholder2Nin}
                    onChange={(file) => updateField("stakeholder2Nin", file)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continue / Submit button */}
      <div className="mt-web-lg">
        <Button
          className="h-[52px] w-full text-[14px]"
          onClick={handleNext}
        >
          {subStep === 2 ? "Proceed to Create Structure" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
