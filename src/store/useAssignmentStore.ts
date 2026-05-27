import { create } from 'zustand';
import { Assignment, WizardForm, GeneratedPaper } from '../types';

export type TabType = 'home' | 'groups' | 'assignments' | 'toolkit' | 'library' | 'settings';
export type GenerationStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed';

interface AssignmentStore {
  activeTab: TabType;
  assignments: Assignment[];
  isSkeletonLoading: boolean;
  generationStatus: GenerationStatus;
  generationLogs: string[];
  activeAssignmentId: string | null;
  wizardStep: 1 | 2 | 3;
  wizardForm: WizardForm;
  generatedPaper: GeneratedPaper | null;
  setActiveTab: (tab: TabType) => void;
  setAssignments: (assignments: Assignment[]) => void;
  addAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => void;
  clearAssignments: () => void;
  resetAssignments: () => void;
  setIsSkeletonLoading: (loading: boolean) => void;
  setGenerationStatus: (status: GenerationStatus) => void;
  addGenerationLog: (log: string) => void;
  clearGenerationLogs: () => void;
  setActiveAssignmentId: (id: string | null) => void;
  setWizardStep: (step: 1 | 2 | 3) => void;
  updateWizardForm: (fields: Partial<WizardForm>) => void;
  resetWizardForm: () => void;
  setGeneratedPaper: (paper: GeneratedPaper | null) => void;
}

const DEFAULT_ASSIGNMENTS: Assignment[] = [
  { id: '1', title: 'Midterm Physics Assessment', assignedDate: '25-05-2026', dueDate: '15-06-2026' },
  { id: '2', title: 'Advanced Calculus & Integration Quiz', assignedDate: '26-05-2026', dueDate: '18-06-2026' },
  { id: '3', title: 'Organic Chemistry Nomenclature Exam', assignedDate: '27-05-2026', dueDate: '20-06-2026' },
  { id: '4', title: 'World History & Industrial Revolution Paper', assignedDate: '27-05-2026', dueDate: '22-06-2026' },
];

const INITIAL_WIZARD_FORM: WizardForm = {
  dueDate: '',
  questionTypes: [
    { id: 'qt-1', type: 'Multiple Choice Questions', questionCount: 4, marks: 1 },
    { id: 'qt-2', type: 'Short Questions', questionCount: 3, marks: 2 },
    { id: 'qt-3', type: 'Diagram/Graph-Based Questions', questionCount: 5, marks: 5 },
    { id: 'qt-4', type: 'Numerical Problems', questionCount: 5, marks: 5 },
  ],
  files: [],
  instructions: '',
  totalQuestions: 25,
  totalMarks: 60,
};

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  activeTab: 'assignments',
  assignments: DEFAULT_ASSIGNMENTS,
  isSkeletonLoading: false,
  generationStatus: 'idle',
  generationLogs: [],
  activeAssignmentId: null,
  wizardStep: 1,
  wizardForm: INITIAL_WIZARD_FORM,
  generatedPaper: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setAssignments: (assignments) => set({ assignments }),
  addAssignment: (assignment) => set((state) => ({ 
    assignments: [assignment, ...state.assignments] 
  })),
  deleteAssignment: (id) => set((state) => ({ 
    assignments: state.assignments.filter((a) => a.id !== id) 
  })),
  clearAssignments: () => set({ assignments: [] }),
  resetAssignments: () => set({ assignments: DEFAULT_ASSIGNMENTS }),
  setIsSkeletonLoading: (loading) => set({ isSkeletonLoading: loading }),
  setGenerationStatus: (status) => set({ generationStatus: status }),
  addGenerationLog: (log) => set((state) => ({ 
    generationLogs: [...state.generationLogs, log] 
  })),
  clearGenerationLogs: () => set({ generationLogs: [] }),
  setActiveAssignmentId: (id) => set({ activeAssignmentId: id }),
  setWizardStep: (step) => set({ wizardStep: step }),
  updateWizardForm: (fields) => set((state) => {
    const updatedForm = { ...state.wizardForm, ...fields };
    
    if (fields.questionTypes) {
      updatedForm.totalQuestions = updatedForm.questionTypes.reduce((sum, item) => sum + item.questionCount, 0);
      updatedForm.totalMarks = updatedForm.questionTypes.reduce((sum, item) => sum + (item.questionCount * item.marks), 0);
    }
    
    return { wizardForm: updatedForm };
  }),
  resetWizardForm: () => set({ 
    wizardForm: INITIAL_WIZARD_FORM, 
    wizardStep: 1,
    generationStatus: 'idle',
    generationLogs: [],
    activeAssignmentId: null,
    generatedPaper: null
  }),
  setGeneratedPaper: (paper) => set({ generatedPaper: paper }),
}));
