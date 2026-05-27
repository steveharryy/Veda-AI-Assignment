'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { createAssignment } from '../services/api';
import { 
  UploadCloud, 
  Plus, 
  X, 
  Minus, 
  ArrowRight,
  FileText,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mic
} from 'lucide-react';
import { Select, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { AIWizardGeneratingSkeleton } from './LoadingSkeleton';
import { QuestionTypeRow } from '../types';

interface CreateAssignmentWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface UploadedFilePreview {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'other';
  previewUrl?: string;
  progress: number;
  status: 'uploading' | 'success';
}

const QUESTION_TYPE_OPTIONS = [
  { value: 'Multiple Choice Questions', label: 'Multiple Choice Questions' },
  { value: 'Short Questions', label: 'Short Questions' },
  { value: 'Long Questions', label: 'Long Questions' },
  { value: 'Diagram/Graph-Based Questions', label: 'Diagram/Graph-Based Questions' },
  { value: 'Numerical Problems', label: 'Numerical Problems' },
];

export const CreateAssignmentWizard: React.FC<CreateAssignmentWizardProps> = ({ onComplete, onCancel }) => {
  const { 
    wizardStep, 
    setWizardStep, 
    wizardForm, 
    updateWizardForm, 
    activeAssignmentId,
    setActiveAssignmentId,
    setGenerationStatus,
    clearGenerationLogs
  } = useAssignmentStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [filesPreview, setFilesPreview] = useState<UploadedFilePreview[]>([]);
  const [formErrors, setFormErrors] = useState<{ dueDate?: string; questionRows?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      filesPreview.forEach(file => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, [filesPreview]);

  // Calculate live totals
  const totalQuestions = wizardForm.questionTypes.reduce((sum, item) => sum + item.questionCount, 0);
  const totalMarks = wizardForm.questionTypes.reduce((sum, item) => sum + (item.questionCount * item.marks), 0);

  // Helper to format file sizes
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Simulate file upload progress
  const processFiles = (files: File[]) => {
    const newPreviews = files.map(file => {
      const id = `file-${Math.random().toString(36).substr(2, 9)}`;
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      
      const preview: UploadedFilePreview = {
        id,
        name: file.name,
        size: formatFileSize(file.size),
        type: isImg ? 'image' : isPdf ? 'pdf' : 'other',
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
        progress: 0,
        status: 'uploading'
      };

      // Progress animation simulation
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 20) + 10;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setFilesPreview(prev => 
            prev.map(f => f.id === id ? { ...f, progress: 100, status: 'success' } : f)
          );
        } else {
          setFilesPreview(prev => 
            prev.map(f => f.id === id ? { ...f, progress: currentProgress } : f)
          );
        }
      }, 100);

      return preview;
    });

    setFilesPreview(prev => [...prev, ...newPreviews]);
    updateWizardForm({ files: [...wizardForm.files, ...files.map(f => f.name)] });
  };

  // Drag and Drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const allowedFiles = Array.from(e.dataTransfer.files).filter(f => 
        f.type === 'application/pdf' || f.type.startsWith('image/')
      );
      if (allowedFiles.length === 0) {
        message.error("Only PDF, PNG, and JPG files are supported");
        return;
      }
      processFiles(allowedFiles);
      message.success(`Attached ${allowedFiles.length} file(s)`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const allowedFiles = Array.from(e.target.files).filter(f => 
        f.type === 'application/pdf' || f.type.startsWith('image/')
      );
      processFiles(allowedFiles);
    }
  };

  const removeFile = (id: string, name: string) => {
    setFilesPreview(prev => {
      const fileToRem = prev.find(f => f.id === id);
      if (fileToRem?.previewUrl) URL.revokeObjectURL(fileToRem.previewUrl);
      return prev.filter(f => f.id !== id);
    });
    updateWizardForm({ files: wizardForm.files.filter(f => f !== name) });
    message.info(`Removed file "${name}"`);
  };

  // Dynamic rows updates
  const handleAddRow = () => {
    // Find unselected question type
    const selectedTypes = wizardForm.questionTypes.map(r => r.type);
    const nextType = QUESTION_TYPE_OPTIONS.find(o => !selectedTypes.includes(o.value))?.value 
      || 'Multiple Choice Questions';

    const newRow: QuestionTypeRow = {
      id: `qt-${Date.now()}`,
      type: nextType,
      questionCount: 5,
      marks: 2
    };

    updateWizardForm({
      questionTypes: [...wizardForm.questionTypes, newRow]
    });
    setFormErrors(prev => ({ ...prev, questionRows: undefined }));
  };

  const handleRemoveRow = (id: string) => {
    if (wizardForm.questionTypes.length <= 1) {
      message.error("At least one question type is required");
      return;
    }
    updateWizardForm({
      questionTypes: wizardForm.questionTypes.filter(row => row.id !== id)
    });
  };

  const handleRowChange = (id: string, field: keyof QuestionTypeRow, value: any) => {
    const updated = wizardForm.questionTypes.map(row => {
      if (row.id === id) {
        let val = value;
        if (field === 'questionCount' || field === 'marks') {
          // Strictly enforce: no negative or zero values
          val = Math.max(1, Number(value));
        }
        return { ...row, [field]: val };
      }
      return row;
    });
    updateWizardForm({ questionTypes: updated });
  };

  // Form Validation and REST API submission
  const handleNextStep = async () => {
    const errors: { dueDate?: string; questionRows?: string } = {};

    if (!wizardForm.dueDate) {
      errors.dueDate = "Due Date is required";
    }

    // Ensure no rows have empty or duplicate types
    const types = wizardForm.questionTypes.map(r => r.type);
    const hasEmpty = types.some(t => !t);
    if (hasEmpty) {
      errors.questionRows = "Question types cannot be left blank";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      message.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Format payload according to Backend Express API spec
      const payload = {
        title: wizardForm.instructions 
          ? wizardForm.instructions.split('\n')[0].slice(0, 32)
          : 'Quiz on Electricity',
        dueDate: wizardForm.dueDate,
        instructions: wizardForm.instructions,
        questionTypes: wizardForm.questionTypes.map(row => ({
          type: row.type,
          questionCount: row.questionCount,
          marks: row.marks
        }))
      };

      // 2. Clear old state telemetry
      clearGenerationLogs();
      setGenerationStatus('pending');

      // 3. Issue asynchronous creation request
      const response = await createAssignment(payload);
      
      // 4. Save assignment ID and transition to Socket.io Loader step
      setActiveAssignmentId(response.assignmentId);
      setWizardStep(2);
    } catch (error: any) {
      message.error(`Submission failed: ${error.message || 'Server connection error.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIFinished = () => {
    // Navigate directly to preview
    setWizardStep(3);
    onComplete();
  };

  return (
    <div className="w-full select-none pb-12 no-print">
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Create Assignment</h1>
          <p className="text-neutral-500 text-[13px] mt-0.5">Set up a new AI-synthesized assignment for your students.</p>
        </div>
      </div>

      {/* Modern Multi-Step Progress Tracker Banner */}
      <div className="max-w-4xl mx-auto bg-white rounded-[20px] px-8 py-5 border border-neutral-100 shadow-sm flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-[12%] right-[12%] h-[2px] bg-neutral-100 -z-10" />
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 left-[12%] right-[12%] h-[2px] bg-black origin-left -z-10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: wizardStep === 1 ? 0 : wizardStep === 2 ? 0.5 : 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Step 1 Node */}
        <div className="flex items-center gap-3 bg-white pr-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
            wizardStep >= 1 ? 'bg-black border-black text-white' : 'bg-white border-neutral-200 text-neutral-400'
          }`}>
            1
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-neutral-800">Details</span>
            <span className="text-[10px] text-neutral-400 -mt-0.5">Setup parameters</span>
          </div>
        </div>

        {/* Step 2 Node */}
        <div className="flex items-center gap-3 bg-white px-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
            wizardStep >= 2 ? 'bg-black border-black text-white ring-4 ring-neutral-100' : 'bg-white border-neutral-200 text-neutral-400'
          }`}>
            2
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-neutral-800">AI Synthesis</span>
            <span className="text-[10px] text-neutral-400 -mt-0.5">Generate paper</span>
          </div>
        </div>

        {/* Step 3 Node */}
        <div className="flex items-center gap-3 bg-white pl-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
            wizardStep === 3 ? 'bg-black border-black text-white shadow-md' : 'bg-white border-neutral-200 text-neutral-400'
          }`}>
            3
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-neutral-800">Review & Export</span>
            <span className="text-[10px] text-neutral-400 -mt-0.5">A4 PDF Preview</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {wizardStep === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto bg-white rounded-[24px] p-8 md:p-10 border border-neutral-100 card-shadow flex flex-col gap-6"
          >
            {/* Inner Header */}
            <div className="border-b border-neutral-50 pb-4">
              <h2 className="text-[17px] font-extrabold text-neutral-900 tracking-tight">Assignment Details</h2>
              <p className="text-neutral-400 text-xs mt-0.5">Provide source documents, select blueprints, and define guidelines</p>
            </div>

            {/* Drag & Drop File Upload Box */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-extrabold text-neutral-800 tracking-tight flex items-center gap-1.5">
                Attached Material <span className="text-neutral-400 font-normal text-[11px]">(Optional)</span>
              </label>
              
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-[2px] border-dashed rounded-[20px] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer select-none transition-all duration-200 ${
                  dragActive 
                    ? 'border-orange-500 bg-orange-50/20' 
                    : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/30'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="application/pdf,image/png,image/jpeg"
                  multiple
                  className="hidden" 
                />
                <div className="w-11 h-11 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100 shadow-inner">
                  <UploadCloud className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-neutral-700">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Supports PDF, PNG, JPG files up to 10MB
                  </p>
                </div>
                <button 
                  type="button"
                  className="h-8 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-full shadow-inner transition-colors active:scale-95"
                >
                  Browse Files
                </button>
              </div>
            </div>

            {/* Premium File Upload Progress & Preview Grid */}
            {filesPreview.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-4 border border-neutral-100 rounded-2xl">
                {filesPreview.map((file) => (
                  <div 
                    key={file.id} 
                    className="bg-white p-3.5 border border-neutral-200 rounded-xl shadow-sm flex items-center gap-3 relative overflow-hidden group"
                  >
                    {/* Visual Preview for Images / Custom Icon for PDFs */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0 flex items-center justify-center">
                      {file.type === 'image' && file.previewUrl ? (
                        <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : file.type === 'pdf' ? (
                        <FileText className="w-5 h-5 text-red-500" />
                      ) : (
                        <Paperclip className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>

                    {/* File data description */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-800 truncate leading-snug">{file.name}</p>
                      <span className="text-[10px] text-neutral-400 mt-0.5 block">{file.size}</span>
                      
                      {/* Loading bar */}
                      {file.status === 'uploading' && (
                        <div className="w-full bg-neutral-100 h-[3px] rounded-full mt-2 overflow-hidden">
                          <div 
                            className="bg-orange-500 h-full rounded-full transition-all duration-100" 
                            style={{ width: `${file.progress}%` }} 
                          />
                        </div>
                      )}
                    </div>

                    {/* Delete item or checkmark */}
                    <div className="flex items-center gap-1.5 z-10">
                      {file.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : null}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFile(file.id, file.name); }}
                        className="w-7 h-7 rounded-full border border-neutral-100 bg-neutral-50 text-neutral-400 hover:text-red-500 hover:border-red-100 flex items-center justify-center transition-colors shadow-sm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form row: Due Date Picker */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-extrabold text-neutral-800 tracking-tight flex items-center gap-1">
                <span>Due Date</span>
                <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="date"
                  value={wizardForm.dueDate}
                  onChange={(e) => {
                    updateWizardForm({ dueDate: e.target.value });
                    setFormErrors(prev => ({ ...prev, dueDate: undefined }));
                  }}
                  className={`w-full h-[48px] px-4 border rounded-[14px] outline-none text-xs sm:text-sm text-neutral-800 shadow-sm focus:border-black transition-all ${
                    formErrors.dueDate ? 'border-red-400 bg-red-50/10' : 'border-neutral-200'
                  }`}
                />
              </div>
              {formErrors.dueDate && (
                <span className="text-[11px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.dueDate}
                </span>
              )}
            </div>

            {/* Dynamic Question Type Blueprint Section */}
            <div className="flex flex-col gap-3 mt-2">
              <label className="text-xs font-extrabold text-neutral-800 tracking-tight">
                Marks Blueprint Rows
              </label>
              
              {/* Counter Table Header */}
              <div className="grid grid-cols-[1fr_110px_110px_40px] gap-4 border-b border-neutral-100 pb-2.5 px-1 items-center">
                <span className="text-[11px] font-bold text-neutral-400">Question Type</span>
                <span className="text-[11px] font-bold text-neutral-400 text-center">No. of Questions</span>
                <span className="text-[11px] font-bold text-neutral-400 text-center">Marks per Q</span>
                <span />
              </div>

              {/* Rows List */}
              <div className="flex flex-col gap-3.5">
                {wizardForm.questionTypes.map((row) => (
                  <div key={row.id} className="grid grid-cols-[1fr_110px_110px_40px] gap-4 px-1 items-center">
                    {/* Ant Design Select component */}
                    <Select
                      value={row.type}
                      onChange={(val) => handleRowChange(row.id, 'type', val)}
                      className="w-full select-modern-dash h-[40px]"
                      options={QUESTION_TYPE_OPTIONS}
                    />

                    {/* Questions Counter */}
                    <div className="flex items-center justify-between border border-neutral-200 bg-neutral-50 px-2 h-[40px] rounded-full shadow-inner select-none">
                      <button
                        type="button"
                        onClick={() => handleRowChange(row.id, 'questionCount', row.questionCount - 1)}
                        disabled={row.questionCount <= 1} // Strict validation: no negative/zero values
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-neutral-500 transition-colors ${
                          row.questionCount <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-black'
                        }`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[13px] font-bold text-neutral-800">{row.questionCount}</span>
                      <button
                        type="button"
                        onClick={() => handleRowChange(row.id, 'questionCount', row.questionCount + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Marks Counter */}
                    <div className="flex items-center justify-between border border-neutral-200 bg-neutral-50 px-2 h-[40px] rounded-full shadow-inner select-none">
                      <button
                        type="button"
                        onClick={() => handleRowChange(row.id, 'marks', row.marks - 1)}
                        disabled={row.marks <= 1} // Strict validation: no negative/zero values
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-neutral-500 transition-colors ${
                          row.marks <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-black'
                        }`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[13px] font-bold text-neutral-800">{row.marks}</span>
                      <button
                        type="button"
                        onClick={() => handleRowChange(row.id, 'marks', row.marks + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Row delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 hover:text-red-500 text-neutral-400 flex items-center justify-center transition-colors shadow-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action buttons under rows */}
              <div className="flex justify-between items-start mt-2">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex items-center gap-1.5 text-xs font-bold text-black border border-neutral-300 hover:border-black bg-white hover:bg-neutral-50 px-4 h-9 rounded-full shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question Type</span>
                </button>

                {/* Live totals sum boxes */}
                <div className="flex flex-col gap-1 text-right select-none pr-1">
                  <span className="text-[13px] font-medium text-neutral-500">
                    Total Questions: <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200 ml-1">{totalQuestions}</span>
                  </span>
                  <span className="text-[13px] font-medium text-neutral-500 mt-1">
                    Total Marks: <span className="font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100 ml-1">{totalMarks}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions box */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-extrabold text-neutral-800 tracking-tight">
                Additional Instructions (Voice / Text prompts)
              </label>
              
              <div className="relative">
                <textarea
                  value={wizardForm.instructions}
                  onChange={(e) => updateWizardForm({ instructions: e.target.value })}
                  placeholder="e.g. Generate a question paper for CBSE Grade 8 Science classes focusing on NCERT Electrolysis and Electroplating chapters. Ensure challenging numerical equations are included."
                  className="w-full min-h-[120px] p-4 pr-12 border border-neutral-200 rounded-[18px] text-[13px] sm:text-sm text-neutral-800 placeholder:text-neutral-400 outline-none shadow-sm focus:border-black transition-all resize-none leading-relaxed"
                />
                
                {/* Voice Prompter mic badge */}
                <button
                  type="button"
                  onClick={() => updateWizardForm({ instructions: "Generate a CBSE Grade 8 NCERT Science exam. Focus 50% on MCQ questions and include 2 diagrams for Diagram-Based questions." })}
                  className="absolute right-4.5 bottom-4.5 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-black flex items-center justify-center shadow-inner transition-colors active:scale-95"
                  title="Load voice prompt suggestion"
                >
                  <Mic className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>

            {/* Navigation pill controls */}
            <div className="flex justify-between items-center border-t border-neutral-100 pt-6 mt-4">
              <button
                type="button"
                onClick={onCancel}
                className="h-[48px] px-8 rounded-full border border-neutral-300 hover:border-black font-semibold text-[14px] text-neutral-700 hover:text-black bg-white transition-all active:scale-95"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="h-[48px] px-8 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold text-[14px] shadow-md flex items-center gap-1.5 transition-all active:scale-95 disabled:bg-neutral-600 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dynamic Real-Time WebSockets-Bound Generating Loader */}
            <AIWizardGeneratingSkeleton 
              assignmentId={activeAssignmentId} 
              onComplete={handleAIFinished} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
