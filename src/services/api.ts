const API_BASE_URL = 'http://localhost:5000/api/assignments';

export interface CreateAssignmentPayload {
  title: string;
  dueDate: string;
  instructions: string;
  questionTypes: Array<{
    type: string;
    questionCount: number;
    marks: number;
  }>;
}

export const createAssignment = async (payload: CreateAssignmentPayload) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit assignment creation request.');
    }

    return data; // Returns { success: true, assignmentId, status }
  } catch (error: any) {
    console.error('💥 [API Service] createAssignment error:', error.message);
    throw error;
  }
};

export const getAssignmentById = async (assignmentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${assignmentId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch assignment details.');
    }

    return data; // Returns { success: true, status, assignment, paper }
  } catch (error: any) {
    console.error(`💥 [API Service] getAssignmentById error for ID: ${assignmentId}:`, error.message);
    throw error;
  }
};
