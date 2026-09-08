import { Unit } from '../types';
import { ELECTIVE_UNITS } from './electives';
import { EXTRA_QUIZZES } from './quizzes';
import { MATH_UNIT } from './math';
import { ALGEBRA_UNIT } from './algebra';
import { GEOMETRY_UNIT } from './geometry';
import { BLUEPRINT_UNIT } from './blueprints';

export { ELECTIVE_UNITS };

export const COURSE_INFO = {
  code: 'UEE22020',
  title: 'Certificate II in Electrotechnology (Career Start)',
  provider: 'TAFE Queensland',
  overview:
    'Kick-start your career in the electrotechnology industry with this entry-level course. Build the skills you need to get your foot in the door for an apprenticeship or seek trade assistant work. You will learn the skills needed to safely undertake basic electrotechnology work and solve problems in extra-low voltage single-path and multiple-path DC circuits. The course covers a General Safety Induction (White Card) and units needed for the first stage of an electrical apprenticeship.',
  outcomes: [
    'Trades Assistant',
    'Electrotechnology Apprentice',
  ],
  totalPoints: 140,
  electivePointsRequired: 220,
  unitsCount: 8,
  expectedJobOpenings: '26,000',
};

export const CORE_UNITS: Unit[] = [
  {
    id: 'c1',
    code: 'CPCCWHS1001',
    name: 'Prepare to work safely in the construction industry',
    description:
      'This unit of competency specifies the mandatory work health and safety training required prior to undertaking construction work. The unit requires the person to demonstrate personal awareness and knowledge of health and safety legislative requirements in order to work safely and prevent injury or harm to self and others. It covers identifying and orally reporting common construction hazards, understanding basic risk control measures, and identifying procedures for responding to potential incidents and emergencies. It also covers correctly selecting and fitting common personal protective equipment (PPE) used for construction work.',
    prerequisites: [],
    points: 20,
    topics: [
      {
        id: 'c1-t1',
        title: 'Introduction to WHS in Construction',
        content:
          'Work Health and Safety (WHS) is a legal framework that protects workers and the public from harm. In the construction industry, WHS is governed by the Work Health and Safety Act 2011 and the Work Health and Safety Regulation 2011. The Person Conducting a Business or Undertaking (PCBU) has a primary duty to ensure, so far as is reasonably practicable, the health and safety of workers and others affected by the work. This includes providing a safe workplace, safe systems of work, and adequate training.',
        keyPoints: [
          'The WHS Act 2011 applies to all construction work in Australia',
          'PCBU (Person Conducting a Business or Undertaking) has primary duty of care',
          'Construction workers have a duty to take reasonable care of their own health and safety',
          'Workers must cooperate with the PCBU on WHS matters',
          'Health and safety representatives can be elected to represent workers',
        ],
        quizQuestions: [
          {
            question: 'What is the primary legislation governing work health and safety in Australia?',
            options: [
              'Occupational Health and Safety Act 2000',
              'Work Health and Safety Act 2011',
              'Safe Work Australia Act 2008',
              'Construction Safety Act 2015',
            ],
            correctAnswer: 1,
          },
          {
            question: 'Who has the primary duty to ensure workplace health and safety?',
            options: [
              'The worker',
              'The PCBU (Person Conducting a Business or Undertaking)',
              'The safety officer',
              'The site supervisor',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: 'c1-t2',
        title: 'Personal Protective Equipment (PPE)',
        content:
          'Personal Protective Equipment (PPE) is the last line of defence in protecting workers from hazards. PPE must be selected based on the specific hazards present on the work site, properly fitted to the individual, and maintained according to the manufacturer\'s instructions. Common PPE in construction includes: hard hats (head protection), safety glasses/goggles (eye protection), hearing protection, high visibility clothing, steel-capped boots (foot and leg protection), gloves (hand protection), and dust masks/respirators (respiratory protection). PPE must be worn at all times in designated areas and replaced when damaged or expired.',
        keyPoints: [
          'PPE is the last line of defence after elimination, substitution, and engineering controls',
          'Hard hat protection is required in all construction zones',
          'Safety glasses must protect against impact, chemical splash, or radiation',
          'High visibility clothing must meet AS/NZS 4652 standards',
          'Steel-capped boots must meet AS/NZS 2210 standards',
          'All PPE must be inspected before each use and replaced if damaged',
        ],
        quizQuestions: [
          {
            question: 'When should PPE be worn on a construction site?',
            options: [
              'Only when heavy machinery is operating',
              'Only during the first week of work',
              'At all times in designated areas and when hazards are present',
              'Only when the supervisor reminds workers',
            ],
            correctAnswer: 2,
          },
        ],
      },
      {
        id: 'c1-t3',
        title: 'Hazard Identification and Risk Control',
        content:
          'Hazards are identified through site walks, incident reports, and consultation with workers. A risk assessment involves identifying the hazard, assessing the likelihood and consequence of harm, and implementing control measures following the hierarchy of controls. The hierarchy of controls, in order of effectiveness, is: 1) Elimination - remove the hazard entirely, 2) Substitution - replace with a less hazardous option, 3) Engineering controls - isolate people from the hazard, 4) Administrative controls - change how people work, 5) Personal Protective Equipment - protect the worker with equipment. Each control must be reviewed to ensure it is effective.',
        keyPoints: [
          'Elimination is the most effective control method',
          'Substitution replaces a hazard with something less dangerous',
          'Engineering controls physically isolate workers from hazards',
          'Administrative controls change work practices and procedures',
          'PPE is the least effective control and should be used with other controls',
        ],
      },
      {
        id: 'c1-t4',
        title: 'Incident and Emergency Procedures',
        content:
          'Incidents must be reported immediately to the site supervisor or PCBU. The incident must be recorded in the site incident register, and all injuries, even minor ones, must be reported. Emergency procedures include knowing the location of first aid kits, fire extinguishers, emergency assembly points, and emergency contact numbers. Workers must know how to raise the alarm, evacuate the site safely, and assist others who may need help. Emergency services (fire, ambulance, police) should be contacted when required.',
        keyPoints: [
          'All incidents must be reported immediately, no matter how minor',
          'Workers must know the location of the emergency assembly point',
          'First aid kits and fire extinguishers must be accessible on site',
          'Emergency evacuation procedures must be practiced regularly',
          'Incident records must be maintained for WHS compliance',
        ],
      },
    ],
  },
  {
    id: 'c2',
    code: 'UEECD0007',
    name: 'Apply work health and safety regulations, codes and practices in the workplace',
    description:
      'This unit involves the skills and knowledge required to apply work health and safety (WHS)/occupational health and safety (OHS) regulations and codes of practices in the electrotechnology workplace.',
    prerequisites: [],
    points: 20,
    topics: [
      {
        id: 'c2-t1',
        title: 'WHS Regulations and Codes of Practice',
        content:
          'In the electrotechnology sector, WHS regulations include the Work Health and Safety Act 2011, the Electrical Safety Act 2008 (QLD), and relevant codes of practice such as the Australian Standard AS/NZS 4836 for work near low-voltage overhead lines. Key regulatory bodies include Safe Work Australia, Workplace Health and Safety Queensland, and Energy Safe Victoria (ESV). The Electrical Safety Regulation 2014 requires licensed electrical workers to perform work safely. Understanding these regulations is critical before commencing any electrical work.',
        keyPoints: [
          'The Electrical Safety Act 2008 (QLD) governs electrical work safety',
          'Safe Work Australia develops national WHS policy',
          'Codes of practice provide practical guidance for compliance',
          'Electrical workers must hold current licences for the work performed',
          'Work near overhead power lines requires specific safety distances',
        ],
        quizQuestions: [
          {
            question: 'What is the minimum approach distance to 11kV overhead power lines?',
            options: [
              '1 metre',
              '2 metres',
              '3 metres',
              'It depends on the voltage and insulation',
            ],
            correctAnswer: 3,
          },
          {
            question: 'Which code of practice covers electrical installations?',
            options: [
              'AS/NZS 3000:2018 (Wiring Rules)',
              'AS/NZS 4360',
              'AS/NZS 4222',
              'AS/NZS 4340',
            ],
            correctAnswer: 0,
          },
        ],
      },
      {
        id: 'c2-t2',
        title: 'Safe Work Permits and Energy Isolation',
        content:
          'Before any electrical work, energy sources must be isolated using Lock Out Tag Out (LOTO) procedures. This involves identifying all energy sources, disconnecting them, locking and tagging the isolation points, testing for dead (voltage testing), and ensuring the work area is clear. A safe work permit may be required for high-risk electrical work. All workers must use approved voltage testers to verify that circuits are de-energised before touching them. Work in live enclosures requires specific authorisations.',
        keyPoints: [
          'LOTO: Lock Out Tag Out - isolate and secure all energy sources',
          'Always test for dead before touching conductors, even if not working on live parts',
          'Use approved voltage testers - never assume a circuit is dead',
          'Safe work permits are required for high-risk electrical tasks',
          'Isolation points must be locked and tagged by each person working on the circuit',
        ],
      },
      {
        id: 'c2-t3',
        'title': 'Risk Assessment for Electrical Work',
        content:
          'Electrical work risk assessments must identify hazards such as electric shock, arc flash, thermal burns, and mechanical hazards. Risk controls include using insulated tools, wearing dielectric gloves and arc-rated clothing, maintaining minimum approach distances, and using proper work platforms. The assessment must consider: the type and level of voltage, fault currents, environmental conditions (moisture, dust), accessibility of live parts, duration of work, and the skill level of workers present. Moisture increases surface conductivity — keep liquids away from live work. Tap water is more conductive than distilled or de-ionised water; neither belongs on an energised installation.',
        keyPoints: [
          'Electric shock can cause cardiac arrest, burns, and neurological damage',
          'Arc flash produces temperatures exceeding 20,000°C',
          'Keep liquids away from live electrical work; tap water is more conductive than distilled water',
          'Insulated tools must be rated for the voltage level being worked on',
          'Dielectric gloves must be inspected before each use and undergo regular testing',
        ],
      },
      {
        id: 'c2-t4',
        'title': 'Emergency Response and First Aid',
        content:
          'In electrical emergencies, never touch a victim still in contact with live electricity. First isolate the power, then call emergency services (000 in Australia). For electric shock victims, check for breathing and pulse, and commence CPR if trained. Do not move victims with suspected spinal injuries. For burns, cool with clean water (not ice), cover with a clean dry dressing, and never apply ointments or break blisters. All incidents must be documented and reported to Workplace Health and Safety Queensland.',
        keyPoints: [
          'Never touch electrical shock victims while they are still energised',
          'Always isolate power before assisting an electrical injury victim',
          'Call 000 for serious electrical injuries',
          'CPR should only be administered by trained personnel',
          'Electrical burns may continue to cause tissue damage internally even after power is removed',
        ],
      },
    ],
  },
  {
    id: 'c3',
    code: 'UEECD0009',
    name: 'Carry out routine work activities in an energy sector environment',
    description:
      'This unit involves the skills and knowledge required to carry out work activities in an energy sector environment. Pre-requisite: UEECD0007.',
    prerequisites: ['UEECD0007'],
    points: 15,
    topics: [
      {
        id: 'c3-t1',
        'title': 'Energy Sector Work Environment',
        content:
          'The Australian energy sector includes electricity generation (coal, gas, hydro, solar, wind, nuclear), transmission (high-voltage networks), distribution (local networks), and retailing. Workers must comply with the security protocols of energy facilities, including obtaining security clearances where required. Environmental regulations apply to all energy sector work, particularly in relation to emissions, waste management, and ecosystem protection. All work must follow the site-specific environmental management plan.',
        keyPoints: [
          'Energy sector includes generation, transmission, distribution, and retail',
          'Security clearances may be required for certain energy facilities',
          'Environmental management plans must be followed in all energy sector work',
          'Work scheduling must account for energy demand periods (peak/off-peak)',
          'Coordination with control room operators is essential for safe work',
        ],
      },
      {
        id: 'c3-t2',
        'title': 'Reading Technical Documentation',
        content:
          'Technical documentation in the energy sector includes safety data sheets (SDS), wiring diagrams, schematic drawings, manufacturer specifications, and work method statements. Wiring diagrams show the relationship between components using standard symbols. Schematic drawings use AS/NZS symbols and include information like voltage ratings, current ratings, and protective device locations. Work method statements (SWMS) detail the safe work procedures, hazards, and controls for specific tasks. All workers must be able to read and interpret these documents before commencing work.',
        keyPoints: [
          'Wiring diagrams show physical connections using standard symbols',
          'Schematic drawings use AS/NZS standard electrical symbols',
          'Safety Data Sheets (SDS) provide chemical hazard and handling information',
          'Work Method Statements (SWMS) detail step-by-step safe work procedures',
          'Manufacturer specifications provide technical ratings and installation instructions',
        ],
      },
      {
        id: 'c3-t3',
        'title': 'Communication and Team Coordination',
        content:
          'Clear communication in the energy sector is critical for safety. Radio communication must use standardised terminology and call signs. Before starting work, a tool-box talk must be conducted to communicate hazards, controls, and work plans. Handover procedures must be followed when teams change shifts. All communication must be logged, and emergency contact procedures must be known. The use of mobile phones in electrical work areas is restricted due to ignition risks and interference concerns.',
        keyPoints: [
          'Tool-box talks must be conducted before starting any work task',
          'Radio communication uses standardised call signs and terminology',
          'Handover logs must be completed during shift changes',
          'Mobile phones are restricted in electrical substations and switchgear rooms',
          'All hazards and controls must be communicated to all team members',
        ],
      },
    ],
  },
  {
    id: 'c4',
    code: 'UEECD0021',
    name: 'Identify and select components, accessories and materials for energy sector work activities',
    description:
      'This unit involves the skills and knowledge required to identify and select components, accessories and materials for energy sector work activities. Pre-requisites: UEECD0007 and UEECD0009.',
    prerequisites: ['UEECD0007', 'UEECD0009'],
    points: 15,
    topics: [
      {
        id: 'c4-t1',
        'title': 'Electrical Components and Their Ratings',
        content:
          'Electrical components must be selected based on their current, voltage, and power ratings. Key ratings include: rated current (the maximum continuous current a component can handle), rated voltage (the maximum safe operating voltage), and breaking capacity (the maximum fault current a protective device can interrupt). Cables must be sized according to AS/NZS 3008 based on current carrying capacity, voltage drop, and installation conditions. Components must also tolerate ambient temperature, humidity, and vibration levels present on site.',
        keyPoints: [
          'Cables must be sized for current carrying capacity and voltage drop',
          'AS/NZS 3008 provides cable sizing tables and methods',
          'Breaking capacity of protective devices must exceed prospective fault current',
          'Components have rated current, voltage, and power limits',
          'Ambient temperature affects current carrying capacity of all components',
        ],
        quizQuestions: [
          {
            question: 'Which international standard provides cable sizing and selection guidelines for Australia?',
            options: [
              'IEC 60364',
              'AS/NZS 3000',
              'AS/NZS 3008',
              'AS/NZS 4534',
            ],
            correctAnswer: 2,
          },
        ],
      },
      {
        id: 'c4-t2',
        'title': 'Protective Devices and Switchgear',
        content:
          'Protective devices include circuit breakers, fuses, residual current devices (RCDs), and miniature circuit breakers (MCBs). Circuit breakers provide overcurrent protection and can be reset. Fuses must be replaced after operation. RCDs detect leakage current to earth and trip at 30mA for personal protection, 100mA for fire protection, and 300mA/500mA for equipment protection. Switchgear includes manual switches, contactors, relays, and isolators. Each device must have a breaking capacity suitable for the circuit it protects.',
        keyPoints: [
          'RCDs trip at 30mA for personal safety, 100mA for fire protection',
          'Circuit breakers provide both overcurrent and short-circuit protection',
          'Fuses must be replaced after each operation and be the correct type',
          'Switchgear must be rated for the system fault level',
          'Manual isolators must provide a visible break for safe work',
        ],
      },
      {
        id: 'c4-t3',
        'title': 'Materials Selection and Compatibility',
        content:
          'Material selection considers conductivity, corrosion resistance, mechanical strength, and cost. Copper is the preferred conductor due to high conductivity and corrosion resistance, but aluminium is used for large feeders where weight is a concern. Insulating materials must have adequate mechanical strength and thermal ratings for the operating temperature. Steel enclosures provide mechanical protection but must be earthed. All materials must be compatible with each other to prevent galvanic corrosion.',
        keyPoints: [
          'Copper has higher conductivity but aluminium is lighter and cheaper for large cables',
          'Insulation materials must be rated for the operating temperature',
          'Steel enclosures must always be earthed',
          'Galvanic corrosion occurs between dissimilar metals in the presence of moisture',
          'Material selection must consider mechanical, electrical, and environmental factors',
        ],
      },
    ],
  },
  {
    id: 'c5',
    code: 'UEECD0038',
    name: 'Provide solutions and report on routine electrotechnology problems',
    description:
      'This unit involves the skills and knowledge required to provide solutions and report on electrotechnology problems.',
    prerequisites: [],
    points: 20,
    topics: [
      {
        id: 'c5-t1',
        'title': 'Problem-Solving Methodology',
        content:
          'The standard electrotechnology problem-solving approach is: 1) Define the problem - gather information from the customer or system status, 2) Analyse the problem - review system diagrams, error codes, and symptoms, 3) Isolate the problem - identify the faulty component or circuit, 4) Plan the solution - determine the repair or replacement needed, 5) Implement the solution - carry out the repair, 6) Test and verify - confirm the system operates correctly, 7) Document - record the fault, cause, and repair for future reference.',
        keyPoints: [
          'Always define the problem fully before attempting a solution',
          'Systematic fault isolation prevents unnecessary part replacement',
          'Always test the circuit is dead before working on it',
          'Document all faults and repairs in the maintenance log',
          'Verify the solution works under full load conditions',
        ],
      },
      {
        id: 'c5-t2',
        'title': 'Fault Diagnosis Techniques',
        content:
          'Fault diagnosis uses a logical sequence of tests to narrow down the location of a fault. Visual inspection checks for obvious damage, loose connections, burnt components, and fluid leaks. Ohmmeter testing checks for open circuits, short circuits, and resistance values. Voltmeter testing checks for presence of voltage and correct voltage levels. Insulation resistance testing (using a megger) checks for insulation breakdown. Current measurements (using a clamp meter) check for overload conditions. Signal tracing helps locate breaks in wiring.',
        keyPoints: [
          'Visual inspection is the first step - check for burnt components and loose connections',
          'Use ohmmeters to test for opens, shorts, and incorrect resistance values',
          'Megger testing detects insulation resistance below safe levels',
          'Clamp meters measure current flow to detect overload or imbalance',
          'Signal tracers help locate breaks or shorts in inaccessible wiring',
        ],
      },
      {
        id: 'c5-t3',
        'title': 'Reporting and Documentation',
        content:
          'Technical reports must include: the reported symptom, the diagnostic steps taken, the identified root cause, the solution applied, the test results confirming the fix, any parts replaced, and recommended follow-up actions. Reports must be clear, accurate, and written for both technical and non-technical audiences. The report should include safety precautions taken and any hazards identified. All reports must be signed off by the person completing the work.',
        keyPoints: [
          'Reports must include symptom, diagnosis, solution, and verification results',
          'Root cause analysis prevents recurring faults',
          'All replaced parts must be listed with part numbers',
          'Safety precautions taken must be documented',
          'Reports should be accessible to both technical and non-technical stakeholders',
        ],
      },
    ],
  },
  {
    id: 'c6',
    code: 'UEECD0046',
    name: 'Solve problems in single path circuits',
    description:
      'This unit involves the skills and knowledge required to solve problems in single path circuits. Pre-requisite: UEECD0007.',
    prerequisites: ['UEECD0007'],
    points: 20,
    topics: [
      {
        id: 'c6-t1',
        'title': 'DC Circuit Fundamentals',
        content:
          'Direct Current (DC) circuits have a single path for current flow. The fundamental laws governing DC circuits are: Ohm\'s Law (V = I x R), Kirchhoff\'s Voltage Law (the sum of all voltages around a closed loop equals zero), and Kirchhoff\'s Current Law (the sum of currents entering a node equals the sum leaving). Power in a DC circuit is calculated as P = V x I = I^2 x R = V^2 / R. Energy is E = P x t (watt-hours or joules).',
        keyPoints: [
          'Ohm\'s Law: Voltage = Current x Resistance (V = I x R)',
          'Kirchhoff\'s Voltage Law: Sum of voltages in a loop = 0',
          'Kirchhoff\'s Current Law: Sum of currents at a node = 0',
          'Power: P = V x I = I^2 x R = V^2 / R',
          'Energy: E = P x t',
        ],
        quizQuestions: [
          {
            question: 'In a DC circuit with 12V supply and 4 ohms resistance, what is the current?',
            options: [
              '48A',
              '3A',
              '0.33A',
              '8A',
            ],
            correctAnswer: 1,
          },
          {
            question: 'What does Kirchhoff\'s Voltage Law state?',
            options: [
              'Current in equals current out at a node',
              'Sum of voltages around a closed loop equals zero',
              'Power equals voltage times current',
              'Resistance equals voltage divided by current',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: 'c6-t2',
        'title': 'Series Circuit Analysis',
        content:
          'In a series circuit, there is only one path for current. All components share the same current. The total resistance is the sum of all individual resistances (R_total = R1 + R2 + R3 + ...). The total voltage equals the sum of voltage drops across each component (V_total = V1 + V2 + V3 + ...). Voltage drops are proportional to resistance. If one component fails (opens), the entire circuit stops. Power ratings of series components must be selected so no component exceeds its power rating.',
        keyPoints: [
          'Current is the same through all components in series',
          'Total resistance = sum of all resistances',
          'Total voltage = sum of voltage drops across components',
          'If one component opens, the entire series circuit fails',
          'Voltage drop is proportional to resistance (V = I x R)',
        ],
      },
      {
        id: 'c6-t3',
        'title': 'Voltage dividers in single-path circuits',
        content:
          'A series voltage divider is still a single path: the same current flows through each resistor. Voltage drop across each resistor is V = I × R, so larger resistances take a larger share of the supply. The output of a two-resistor divider is Vout = Vin × R2 / (R1 + R2) when taken across R2. Loading the output with another path turns the circuit into a multiple-path problem, which is covered in UEECD0044.',
        keyPoints: [
          'A voltage divider is a series (single-path) arrangement',
          'Voltage drop is proportional to resistance at the same current',
          'Vout = Vin × R2 / (R1 + R2) for an unloaded two-resistor divider',
          'Loading the output adds a parallel path — that is not a single-path circuit',
          'Parallel and series-parallel analysis belongs with UEECD0044',
        ],
      },
      {
        id: 'c6-t4',
        'title': 'Troubleshooting Single-Path Circuits',
        content:
          'Troubleshooting method: 1) Visual inspection for obvious faults, 2) Verify power supply voltage, 3) Check for open circuits using an ohmmeter, 4) Check for short circuits, 5) Measure voltage at key points to locate where voltage is lost, 6) Check individual component resistance values, 7) Verify current flow with a clamp meter, 8) Compare measured values to expected values from calculations. Common problems include open circuits, short circuits, incorrect component values, and poor connections.',
        keyPoints: [
          'Always start with a visual inspection',
          'Verify the power supply is operating before blaming circuit components',
          'Measure voltage at strategic points to isolate the fault location',
          'Poor connections can mimic open circuits',
          'Never apply power to a circuit you haven\'t inspected first',
        ],
      },
      {
        id: 'c6-t5',
        'title': 'Measurement Instruments',
        content:
          'Multimeters measure voltage (AC/DC), current (AC/DC), and resistance. Voltage is measured in parallel with the circuit under test. Current is measured in series, requiring the circuit to be broken. Resistance is measured with power off. Clamp meters measure current without breaking the circuit. Insulation resistance testers (meggers) apply high DC voltage to test insulation integrity. Always use the correct measurement range and never exceed instrument ratings.',
        keyPoints: [
          'Voltage is measured in parallel with the load',
          'Current is measured in series - the circuit must be broken',
          'Resistance is measured with power off and component isolated',
          'Clamp meters measure current without breaking the circuit',
          'Megger testing uses high voltage to verify insulation integrity',
        ],
      },
    ],
  },
  {
    id: 'c7',
    code: 'UEECD0052',
    name: 'Use routine equipment/plant/technologies in an energy sector environment',
    description:
      'This unit involves the skills and knowledge required to use routine equipment, plant, technologies and personnel protective equipment (PPE) in an energy sector environment. Pre-requisite: UEECD0007.',
    prerequisites: ['UEECD0007'],
    points: 15,
    topics: [
      {
        id: 'c7-t1',
        'title': 'Common Tools and Equipment',
        content:
          'Electrical tradespeople use hand tools (screwdrivers, pliers, wire strippers, crimpers, hammers), power tools (drills, saws, grinders, sanders), and measuring instruments (multimeters, oscilloscopes, insulation testers). Each tool must be inspected before use for damage, proper operation, and calibration status. Power tools must be used according to the manufacturer\'s instructions and with appropriate PPE. Tools must be maintained according to manufacturer schedules, typically including cleaning, lubrication, and periodic inspection by a qualified person.',
        keyPoints: [
          'All tools must be inspected before each use',
          'Power tools require appropriate PPE (safety glasses, hearing protection)',
          'Measuring instruments must be calibrated according to schedule',
          'Tools must be stored properly to prevent damage and injury',
          'Only qualified persons should perform tool maintenance',
        ],
        quizQuestions: [
          {
            question: 'Before using a power drill on an electrical job, what PPE should you wear?',
            options: [
              'Safety glasses only',
              'Safety glasses and gloves',
              'Safety glasses, hearing protection, and steel-capped boots',
              'Just gloves',
            ],
            correctAnswer: 2,
          },
        ],
      },
      {
        id: 'c7-t2',
        'title': 'Equipment Operation and Safety Checks',
        content:
          'Before operating any plant or equipment, conduct pre-start safety checks: verify fuel/electrical supply, check fluid levels, inspect for leaks, verify safety guards are in place, test emergency stop functions, and ensure the area is clear. The equipment must be suitable for the work task and match the operator\'s competency level. Never modify equipment beyond its original design. Tag out any equipment that fails pre-start checks. Keep an equipment usage log with date, operator, task, and any issues noted.',
        keyPoints: [
          'Pre-start safety checks are mandatory before every use',
          'Operators must be trained and competent for the equipment they use',
          'Emergency stop functions must be tested before each use',
          'Never operate equipment with safety guards removed',
          'Equipment logs must record all usage and incidents',
        ],
      },
      {
        id: 'c7-t3',
        'title': 'Routine Maintenance Procedures',
        content:
          'Routine maintenance follows the manufacturer\'s schedule and includes: visual inspections, lubrication, cleaning, calibration, tightening of fasteners, checking wear items, and fluid replacement. Preventive maintenance reduces unplanned downtime and extends equipment life. Before any maintenance, the equipment must be fully isolated (LOTO), and maintenance personnel must wear appropriate PPE. Maintenance records must be kept and used to identify trends in equipment reliability.',
        keyPoints: [
          'Preventive maintenance reduces unexpected equipment failures',
          'All maintenance must follow LOTO procedures',
          'Maintenance personnel must be qualified for the equipment type',
          'Records must track maintenance history and component replacements',
          'Scheduled maintenance intervals must be strictly followed',
        ],
      },
    ],
  },
  {
    id: 'c8',
    code: 'UEERE0021',
    name: 'Provide basic sustainable energy solutions for energy reduction in residential premises',
    description:
      'This unit involves the skills and knowledge required to provide sustainable energy solutions for energy reduction in residential premises.',
    prerequisites: [],
    points: 15,
    topics: [
      {
        id: 'c8-t1',
        'title': 'Energy Efficiency Fundamentals',
        'content':
          'Residential energy consumption can be reduced through multiple strategies. Lighting accounts for 10-15% of home energy use - switching to LED bulbs reduces consumption by up to 85%. Heating and cooling account for 40-50% - improving insulation, sealing air leaks, and using programmable thermostats can cut this significantly. Standby power from appliances (phantom load) accounts for 5-10% - using smart power strips and unplugging devices helps. Hot water heating is 15-20% - lowering the hot water heater temperature to 60°C and insulating hot water pipes and tanks reduces waste.',
        'keyPoints': [
          'LED lighting uses up to 85% less energy than incandescent bulbs',
          'Heating and cooling account for the largest portion of residential energy use',
          'Improving insulation and sealing leaks reduces heating and cooling costs',
          'Standby power (phantom load) can account for 5-10% of home energy',
          'Reducing hot water heater temperature to 60C saves significant energy',
        ],
        'quizQuestions': [
          {
            'question': 'Approximately what percentage of residential energy use is attributed to heating and cooling?',
            'options': [
              '10-15%',
              '20-25%',
              '40-50%',
              '60-70%',
            ],
            'correctAnswer': 2,
          },
          {
            'question': 'What is the recommended hot water heater temperature for energy efficiency?',
            'options': [
              '40°C',
              '50°C',
              '60°C',
              '70°C',
            ],
            'correctAnswer': 2,
          },
        ],
      },
      {
        id: 'c8-t2',
        'title': 'Renewable Energy Systems for Homes',
        'content':
          'Solar photovoltaic (PV) systems convert sunlight directly into electricity using semiconductor cells, typically silicon. A standard residential solar system includes solar panels (10-20 panels of 300-400W each), an inverter (string, micro, or power optimiser based), mounting rails, and a connection to the grid via a bi-directional meter. Solar hot water systems use collectors to heat water stored in an insulated tank. Heat pumps extract heat from ambient air for water heating. Small wind turbines and micro-hydro systems may be viable in specific locations. Feed-in tariffs allow excess energy to be sold back to the grid.',
        'keyPoints': [
          'Solar PV panels convert sunlight to electricity using silicon cells',
          'Inverters convert DC from panels to AC for home use and grid export',
          'Standard residential systems are 5-8 kW (15-25 panels)',
          'Feed-in tariffs allow selling excess energy back to the grid',
          'Solar hot water and heat pumps provide efficient water heating',
        ],
      },
      {
        id: 'c8-t3',
        'title': 'Energy Auditing and Monitoring',
        'content':
          'A residential energy audit involves inspecting the building envelope (insulation, windows, doors), electrical systems (lighting, appliances, HVAC), and occupancy patterns. Tools include thermal imaging cameras to detect heat loss, clamp meters to measure appliance energy use, data loggers for interval recording, and smart meters for real-time monitoring. The audit produces a report prioritising improvements by cost-effectiveness. Simple measures (LED bulbs, sealant) have quick payback; larger measures (insulation upgrade, solar) have longer payback periods. Payback period = investment cost / annual energy savings.',
        'keyPoints': [
          'Thermal imaging detects heat loss through walls, windows, and roofs',
          'Clamp meters measure energy use of individual appliances',
          'Smart meters provide real-time energy consumption data',
          'Payback period = investment cost divided by annual savings',
          'Simple measures typically have 1-2 year payback; larger upgrades take longer',
        ],
      },
    ],
  },
];

function withQuizzes(units: Unit[]): Unit[] {
  return units.map((unit) => ({
    ...unit,
    kind: unit.kind ?? 'core',
    topics: unit.topics.map((topic) => ({
      ...topic,
      quizQuestions:
        topic.quizQuestions && topic.quizQuestions.length > 0
          ? topic.quizQuestions
          : EXTRA_QUIZZES[topic.id],
    })),
  }));
}

export const CORE_UNITS_WITH_QUIZZES = withQuizzes(CORE_UNITS);
export const ELECTIVE_UNITS_WITH_QUIZZES = withQuizzes(ELECTIVE_UNITS);
export const ALL_UNITS = [
  ...CORE_UNITS_WITH_QUIZZES,
  ...ELECTIVE_UNITS_WITH_QUIZZES,
];

export function findTopic(unitId: string, topicId: string) {
  const unit = [
    ...ALL_UNITS,
    MATH_UNIT,
    ALGEBRA_UNIT,
    GEOMETRY_UNIT,
    BLUEPRINT_UNIT,
  ].find((item) => item.id === unitId);
  return unit?.topics.find((topic) => topic.id === topicId);
}
