import { IAssignment, IGeneratedSection, IGeneratedQuestion } from '../types';

interface GeneratedMockPaper {
  title: string;
  schoolName: string;
  subject: string;
  gradeClass: string;
  timeAllowed: string;
  maxMarks: string;
  sections: IGeneratedSection[];
  answerKey: string[];
}

// Rich item banks for popular topics to make mock responses look incredibly realistic and human-crafted
const ITEM_BANKS: Record<string, { questions: Record<string, Array<{ text: string; difficulty: 'Easy' | 'Moderate' | 'Hard'; answer: string }>> }> = {
  electricity: {
    questions: {
      'Multiple Choice Questions': [
        { text: 'Which of the following materials is an excellent electrical conductor?', difficulty: 'Easy', answer: 'Copper. Copper has low resistivity due to a high density of free conduction electrons.' },
        { text: 'What is the SI unit of electric potential difference?', difficulty: 'Easy', answer: 'Volt (V). It represents the work done per unit charge in moving an electron between two points.' },
        { text: 'According to Ohm\'s Law, what happens to current if resistance is doubled under constant voltage?', difficulty: 'Moderate', answer: 'The current is halved (I = V/R).' },
        { text: 'What device is used to measure electrical current in a circuit?', difficulty: 'Easy', answer: 'Ammeter, which is always connected in series.' }
      ],
      'Short Questions': [
        { text: 'Explain the fundamental difference between alternating current (AC) and direct current (DC).', difficulty: 'Moderate', answer: 'DC flows in one constant direction with steady magnitude. AC periodically reverses its direction and alters its magnitude continuously.' },
        { text: 'Why is copper widely preferred over iron for electrical wiring in residential buildings?', difficulty: 'Easy', answer: 'Copper has significantly lower electrical resistivity than iron, resulting in minimal thermal energy losses (I^2R) and higher transmission efficiency.' },
        { text: 'Define electrical resistance and list the physical parameters that govern it.', difficulty: 'Moderate', answer: 'Resistance is the opposition to current flow. It is proportional to length (L), inversely proportional to cross-sectional area (A), and governed by material resistivity (rho): R = rho * L / A.' }
      ],
      'Diagram/Graph-Based Questions': [
        { text: 'Analyze the given schematic of a parallel circuit with three resistors. Compute the equivalent resistance and explain why parallel circuits are used in household wiring.', difficulty: 'Hard', answer: 'In parallel, 1/Rp = 1/R1 + 1/R2 + 1/R3. Parallel wiring is used in homes because it ensures that if one appliance fails, other branches remain active under a constant 220V supply.' },
        { text: 'Draw and interpret the characteristic V-I graph for an ohmic conductor versus a non-ohmic thermistor.', difficulty: 'Hard', answer: 'An ohmic conductor exhibits a linear, straight-line V-I graph passing through the origin (constant slope = resistance). A thermistor yields a non-linear curved line, showing resistance dropping as temperature rises.' }
      ],
      'Numerical Problems': [
        { text: 'A heating element connected to a 220V power supply draws a current of 5A. Compute its resistance and the thermal energy dissipated over 10 minutes.', difficulty: 'Moderate', answer: 'Resistance R = V / I = 220V / 5A = 44 Ohms. Energy E = V * I * t = 220V * 5A * (10 * 60s) = 660,000 Joules (660 kJ).' },
        { text: 'Calculate the total cost of operating a 2kW air conditioner for 8 hours daily over a 30-day billing cycle, assuming electricity costs $0.15 per kWh.', difficulty: 'Hard', answer: 'Energy consumed = Power * Time = 2kW * (8 hours * 30 days) = 480 kWh. Total cost = 480 kWh * $0.15 = $72.00.' }
      ]
    }
  },
  generic: {
    questions: {
      'Multiple Choice Questions': [
        { text: 'Which of the following represents a primary cognitive domain under Bloom\'s Taxonomy?', difficulty: 'Easy', answer: 'Evaluation. Bloom\'s domains span Knowledge, Comprehension, Application, Analysis, Synthesis, and Evaluation.' },
        { text: 'What is the primary role of a hypothesis in scientific methodologies?', difficulty: 'Easy', answer: 'To formulate a testable, tentative explanation for an observed physical phenomenon.' }
      ],
      'Short Questions': [
        { text: 'Differentiate between qualitative and quantitative observations in empirical research.', difficulty: 'Easy', answer: 'Qualitative observations rely on descriptive sensory details (color, texture). Quantitative observations represent absolute numerical metrics (mass, temperature).' },
        { text: 'Explain the law of conservation of energy and provide a day-to-day conversion example.', difficulty: 'Moderate', answer: 'Energy cannot be created or destroyed; it can only transition from one form to another. For example, a lightbulb converts electrical energy into luminous radiation and thermal energy.' }
      ],
      'Diagram/Graph-Based Questions': [
        { text: 'Interpret the provided velocity-time graph showing a vehicle moving with uniform negative acceleration. Determine the stopping distance.', difficulty: 'Hard', answer: 'The stopping distance is calculated by computing the geometric area under the velocity-time curve between the initial speed and the stop point.' }
      ],
      'Numerical Problems': [
        { text: 'A vehicle starts from rest and accelerates uniformly at 2 m/s^2 over a duration of 10 seconds. Find the final velocity and total displacement.', difficulty: 'Moderate', answer: 'Final velocity v = u + a*t = 0 + (2 * 10) = 20 m/s. Displacement s = u*t + 0.5*a*t^2 = 0 + 0.5 * 2 * 100 = 100 meters.' }
      ]
    }
  }
};

export const generateMockQuestionPaper = (assignment: IAssignment): GeneratedMockPaper => {
  const titleText = assignment.title.toLowerCase();
  
  // Decide item bank based on topic matching keywords
  const bank = titleText.includes('electricity') || titleText.includes('circuit') || titleText.includes('electric')
    ? ITEM_BANKS.electricity
    : ITEM_BANKS.generic;

  const sections: IGeneratedSection[] = [];
  const answerKey: string[] = [];
  let globalQNum = 1;

  // Iterate over questionTypes blueprints and dynamically compile sections
  assignment.questionTypes.forEach((qtRow, secIdx) => {
    const sectionChar = String.fromCharCode(65 + secIdx); // A, B, C...
    const questions: IGeneratedQuestion[] = [];
    
    // Fetch template questions for this category
    const bankCategory = bank.questions[qtRow.type] || ITEM_BANKS.generic.questions[qtRow.type] || ITEM_BANKS.generic.questions['Short Questions'];
    
    for (let i = 0; i < qtRow.questionCount; i++) {
      // Pick template cyclically to prevent out of bounds and allow arbitrary counts
      const template = bankCategory[i % bankCategory.length];
      
      const difficultyOrder: Array<'Easy' | 'Moderate' | 'Hard'> = ['Easy', 'Moderate', 'Hard'];
      const difficulty = template.difficulty || difficultyOrder[i % 3];

      questions.push({
        question: template.text.replace('given', `standard Topic #${i + 1}`),
        difficulty,
        marks: qtRow.marks
      });

      // Append answer key details mapped to the sequential global index
      answerKey.push(`[Question ${globalQNum}] Model Answer:\n${template.answer}`);
      globalQNum++;
    }

    sections.push({
      title: `Section ${sectionChar}`,
      instruction: `${qtRow.type}\nAttempt all questions. Each question carries ${qtRow.marks} ${qtRow.marks === 1 ? 'mark' : 'marks'}.`,
      questions
    });
  });

  const maxMarks = sections.reduce((total, sec) => 
    total + sec.questions.reduce((sum, q) => sum + q.marks, 0), 0
  );

  return {
    title: `${assignment.title} — AI Assessment Paper`,
    schoolName: 'Delhi Public School',
    subject: 'Science',
    gradeClass: 'Class VIII',
    timeAllowed: '3 Hours',
    maxMarks: maxMarks.toString(),
    sections,
    answerKey
  };
};
export default generateMockQuestionPaper;
