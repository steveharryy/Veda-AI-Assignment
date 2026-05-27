import { GeneratedPaper } from '../types';

export const SAMPLE_PAPERS: Record<string, GeneratedPaper> = {
  '1': {
    title: 'Midterm Physics Assessment',
    schoolName: 'Delhi Public School',
    subject: 'Physics',
    gradeClass: 'Class XI',
    timeAllowed: '2 Hours',
    maxMarks: '40',
    sections: [
      {
        title: 'Section A',
        instruction: 'Multiple Choice Questions. Attempt all questions. Each question carries 1 mark.',
        questions: [
          { question: 'Which of the following is a fundamental SI unit?', difficulty: 'Easy', marks: 1 },
          { question: 'What does the slope of a velocity-time graph represent?', difficulty: 'Easy', marks: 1 },
          { question: 'Under constant acceleration, if initial velocity is zero, displacement is proportional to:', difficulty: 'Moderate', marks: 1 },
          { question: 'What is the dimensional formula for force?', difficulty: 'Moderate', marks: 1 }
        ]
      },
      {
        title: 'Section B',
        instruction: 'Short Answer Questions. Attempt all questions. Each question carries 3 marks.',
        questions: [
          { question: 'Distinguish between scalar and vector quantities, giving two examples of each.', difficulty: 'Easy', marks: 3 },
          { question: 'State Newton\'s Second Law of Motion and derive the equation F = ma.', difficulty: 'Moderate', marks: 3 },
          { question: 'Explain why a person sitting in a moving bus falls forward when the brakes are suddenly applied.', difficulty: 'Moderate', marks: 3 }
        ]
      },
      {
        title: 'Section C',
        instruction: 'Long Answer Questions. Attempt all questions. Each question carries 5 marks.',
        questions: [
          { question: 'State the Law of Conservation of Linear Momentum. Describe a practical application of momentum conservation in rocketry.', difficulty: 'Hard', marks: 5 },
          { question: 'Derive the equations of motion v = u + at and s = ut + 0.5at^2 using graphical methods.', difficulty: 'Hard', marks: 5 }
        ]
      }
    ],
    answerKey: [
      '[Question 1] Model Answer:\nKelvin (or Kilogram, Meter, Second, Ampere, Mole, Candela).',
      '[Question 2] Model Answer:\nThe slope of a velocity-time graph represents Acceleration (a = dv/dt).',
      '[Question 3] Model Answer:\nSquare of time (t^2), derived from s = 0.5at^2.',
      '[Question 4] Model Answer:\n[MLT^-2] derived from Force = Mass x Acceleration.',
      '[Question 5] Model Answer:\nScalars have magnitude only (e.g., speed, mass). Vectors have both magnitude and direction (e.g., velocity, force).',
      '[Question 6] Model Answer:\nNewton\'s Second Law states that the rate of change of momentum is proportional to the applied force: F = dp/dt = d(mv)/dt = m(dv/dt) = ma.',
      '[Question 7] Model Answer:\nDue to inertia of motion. When the brakes are applied, the lower part of the body comes to rest with the bus, while the upper part tends to continue moving forward.',
      '[Question 8] Model Answer:\nIn an isolated system, the total linear momentum remains constant: m1u1 + m2u2 = m1v1 + m2v2. Rockets operate by expelling gas backward at high velocity, generating a forward thrust according to momentum conservation.',
      '[Question 9] Model Answer:\n1. Acceleration a is the slope of the v-t line: a = (v - u)/t => v = u + at.\n2. Area under v-t graph = displacement s = rectangle area + triangle area = ut + 0.5(v - u)t = ut + 0.5at^2.'
    ]
  },
  '2': {
    title: 'Advanced Calculus & Integration Quiz',
    schoolName: 'Delhi Public School',
    subject: 'Mathematics',
    gradeClass: 'Class XII',
    timeAllowed: '2 Hours',
    maxMarks: '30',
    sections: [
      {
        title: 'Section A',
        instruction: 'Multiple Choice Questions. Attempt all questions. Each question carries 2 marks.',
        questions: [
          { question: 'Evaluate the definite integral of cos(x) from 0 to pi/2.', difficulty: 'Easy', marks: 2 },
          { question: 'What is the derivative of e^(3x^2) with respect to x?', difficulty: 'Moderate', marks: 2 },
          { question: 'Evaluate the limit of sin(x)/x as x approaches 0.', difficulty: 'Easy', marks: 2 }
        ]
      },
      {
        title: 'Section B',
        instruction: 'Short Answer Questions. Attempt all questions. Each question carries 4 marks.',
        questions: [
          { question: 'Evaluate the indefinite integral of x * ln(x) dx using integration by parts.', difficulty: 'Moderate', marks: 4 },
          { question: 'Find the area of the region bounded by the curve y = x^2 and the line y = 4.', difficulty: 'Moderate', marks: 4 },
          { question: 'Solve the differential equation dy/dx = (3x^2 + 2x) / (2y) given y(0) = 2.', difficulty: 'Hard', marks: 4 }
        ]
      },
      {
        title: 'Section C',
        instruction: 'Complex Integration. Attempt all questions. Each question carries 6 marks.',
        questions: [
          { question: 'Evaluate the integral of 1 / (x^2 + 4x + 13) dx using the method of completing the square.', difficulty: 'Hard', marks: 6 },
          { question: 'State the Fundamental Theorem of Calculus and use it to find the derivative of the integral of sqrt(t^3 + 1) dt from 1 to x^2.', difficulty: 'Hard', marks: 6 }
        ]
      }
    ],
    answerKey: [
      '[Question 1] Model Answer:\n[sin(x)] from 0 to pi/2 = sin(pi/2) - sin(0) = 1.',
      '[Question 2] Model Answer:\nBy chain rule: d/dx(e^(3x^2)) = e^(3x^2) * d/dx(3x^2) = 6x * e^(3x^2).',
      '[Question 3] Model Answer:\n1 (by L\'Hopital\'s Rule or standard limit theorem).',
      '[Question 4] Model Answer:\nUsing Parts (u = ln(x), dv = x dx): Integral = 0.5 * x^2 * ln(x) - integral(0.5 * x^2 * (1/x) dx) = 0.5 * x^2 * ln(x) - 0.25 * x^2 + C.',
      '[Question 5] Model Answer:\nIntersection points: x = -2 and x = 2. Area = integral from -2 to 2 of (4 - x^2) dx = [4x - x^3/3] = 16 - 16/3 = 32/3 = 10.67 square units.',
      '[Question 6] Model Answer:\nSeparate variables: 2y dy = (3x^2 + 2x) dx. Integrate both sides: y^2 = x^3 + x^2 + C. Using boundary condition y(0) = 2 => 4 = C. Therefore, y = sqrt(x^3 + x^2 + 4).',
      '[Question 7] Model Answer:\nComplete the square: x^2 + 4x + 13 = (x + 2)^2 + 9. Integral = integral of 1 / ((x+2)^2 + 3^2) dx = (1/3) * arctan((x+2)/3) + C.',
      '[Question 8] Model Answer:\nBy FTC and Leibniz Rule: d/dx [integral from a to g(x) of f(t) dt] = f(g(x)) * g\'(x). Result = sqrt((x^2)^3 + 1) * 2x = 2x * sqrt(x^6 + 1).'
    ]
  },
  '3': {
    title: 'Organic Chemistry Nomenclature Exam',
    schoolName: 'Delhi Public School',
    subject: 'Chemistry',
    gradeClass: 'Class XI',
    timeAllowed: '1.5 Hours',
    maxMarks: '25',
    sections: [
      {
        title: 'Section A',
        instruction: 'Multiple Choice Questions. Attempt all questions. Each question carries 1 mark.',
        questions: [
          { question: 'What is the IUPAC name for CH3-CH2-CH(CH3)-CH3?', difficulty: 'Easy', marks: 1 },
          { question: 'Which functional group takes highest priority in IUPAC nomenclature rules?', difficulty: 'Easy', marks: 1 },
          { question: 'What is the common name for Propan-2-one?', difficulty: 'Easy', marks: 1 },
          { question: 'State the hybridization of carbon in a carbonyl group (>C=O).', difficulty: 'Moderate', marks: 1 }
        ]
      },
      {
        title: 'Section B',
        instruction: 'Short Answer Nomenclature. Attempt all questions. Each question carries 3 marks.',
        questions: [
          { question: 'Write the structural formula and IUPAC name for the simplest ketone.', difficulty: 'Easy', marks: 3 },
          { question: 'Explain the priority sequence rules (CIP rules) used to determine stereocenter configurations.', difficulty: 'Moderate', marks: 3 },
          { question: 'Provide IUPAC names for: (a) CH3-CH=CH-COOH, (b) Benzene-1,2-diol.', difficulty: 'Moderate', marks: 3 }
        ]
      },
      {
        title: 'Section C',
        instruction: 'Structural Synthesis. Attempt all questions. Each question carries 6 marks.',
        questions: [
          { question: 'Draw and write the IUPAC names for all structural isomers of alcohols with molecular formula C4H10O.', difficulty: 'Hard', marks: 6 },
          { question: 'State IUPAC rules for naming polyfunctional organic compounds containing carboxylic acid and ketone groups.', difficulty: 'Hard', marks: 6 }
        ]
      }
    ],
    answerKey: [
      '[Question 1] Model Answer:\n2-Methylbutane.',
      '[Question 2] Model Answer:\nCarboxylic Acid (-COOH) functional group.',
      '[Question 3] Model Answer:\nAcetone.',
      '[Question 4] Model Answer:\nsp2 hybridization.',
      '[Question 5] Model Answer:\nAcetone (Propan-2-one): CH3-CO-CH3.',
      '[Question 6] Model Answer:\nCahn-Ingold-Prelog (CIP) rules rank groups based on atomic number of directly attached atoms. High atomic number gets higher priority. If isotopes match, look at atomic mass.',
      '[Question 7] Model Answer:\n(a) But-2-enoic acid, (b) Catechol (Benzene-1,2-diol).',
      '[Question 8] Model Answer:\nFour isomers:\n1. Butan-1-ol (CH3-CH2-CH2-CH2OH)\n2. Butan-2-ol (CH3-CH2-CH(OH)-CH3)\n3. 2-Methylpropan-1-ol ((CH3)2CH-CH2OH)\n4. 2-Methylpropan-2-ol ((CH3)3COH).',
      '[Question 9] Model Answer:\nIdentify principal functional group (highest priority Carboxylic acid gets suffix -oic acid and principal chain locant #1). Ketone is treated as substituent named "oxo". Chain is numbered from acid end.'
    ]
  },
  '4': {
    title: 'World History & Industrial Revolution Paper',
    schoolName: 'Delhi Public School',
    subject: 'Social Science',
    gradeClass: 'Class VIII',
    timeAllowed: '2 Hours',
    maxMarks: '30',
    sections: [
      {
        title: 'Section A',
        instruction: 'Multiple Choice Questions. Attempt all questions. Each question carries 1 mark.',
        questions: [
          { question: 'In which country did the Industrial Revolution originate?', difficulty: 'Easy', marks: 1 },
          { question: 'Who invented the steam engine that powered factories?', difficulty: 'Easy', marks: 1 },
          { question: 'Which fuel source replaced wood during the early industrialization era?', difficulty: 'Easy', marks: 1 },
          { question: 'What was the major transportation innovation of the 19th century?', difficulty: 'Moderate', marks: 1 }
        ]
      },
      {
        title: 'Section B',
        instruction: 'Short Analytical Questions. Attempt all questions. Each question carries 4 marks.',
        questions: [
          { question: 'Explain the domestic system of production that existed before the factory system.', difficulty: 'Moderate', marks: 4 },
          { question: 'Describe the working conditions of child laborers in early textile mills.', difficulty: 'Moderate', marks: 4 },
          { question: 'How did the Enclosure Acts contribute to rural migration into industrial cities?', difficulty: 'Hard', marks: 4 }
        ]
      },
      {
        title: 'Section C',
        instruction: 'Long Essay Question. Attempt all questions. Each question carries 7 marks.',
        questions: [
          { question: 'Analyze the major social, economic, and political impacts of the Industrial Revolution on human civilization.', difficulty: 'Hard', marks: 7 },
          { question: 'Discuss how the rise of industrialization led to the growth of trade unions and labor rights movements.', difficulty: 'Hard', marks: 7 }
        ]
      }
    ],
    answerKey: [
      '[Question 1] Model Answer:\nGreat Britain (around mid-18th century).',
      '[Question 2] Model Answer:\nJames Watt (who improved Thomas Newcomen\'s design).',
      '[Question 3] Model Answer:\nCoal.',
      '[Question 4] Model Answer:\nSteam locomotive / Railway networks.',
      '[Question 5] Model Answer:\nThe domestic system involved merchants supplying raw materials to rural families who spun and wove them into goods inside their own homes (cottage industry). Production was decentralized and manual.',
      '[Question 6] Model Answer:\nExtremely harsh. Children worked 12-16 hour days, faced physical abuse, low wages, hazardous dust leading to respiratory diseases, and dangerous machinery causing frequent amputations.',
      '[Question 7] Model Answer:\nThe Enclosure Acts consolidated peasant fields into private farming estates. Small farmers lost access to common grazing lands, leaving them landless and forcing them to migrate to cities in search of factory work.',
      '[Question 8] Model Answer:\n1. Social: Rapid urbanization, rise of tenements, emergence of middle and working classes.\n2. Economic: Shift from agricultural base to manufacturing, mass production, capital accumulation, global trade.\n3. Political: Reforms in voting rights, expansion of empire for raw materials, rise of socialist ideologies.',
      '[Question 9] Model Answer:\nIndustrialization grouped hundreds of workers under single roofs under low pay and dangerous conditions. This shared suffering fostered solidarity, leading to unions, strikes, and eventual factory laws restricting hours.'
    ]
  }
};
