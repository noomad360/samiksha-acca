export type Question =
  | {
      id: number;
      type: "mcq";
      section?: "A" | "B";
      prompt: string;
      options: { key: string; text: string }[];
      correct: string;
      explanation: string;
      marks?: number;
    }
  | {
      id: number;
      type: "multi";
      section?: "A" | "B";
      prompt: string;
      options: { key: string; text: string }[];
      correct: string[];
      explanation: string;
      marks?: number;
    }
  | {
      id: number;
      type: "numeric";
      section?: "A" | "B";
      prompt: string;
      correct: number;
      tolerance?: number;
      unit?: string;
      explanation: string;
      marks?: number;
    }
  | {
      id: number;
      type: "long";
      section: "B";
      title: string;
      prompt: string;
      requirements: { label: string; text: string; marks: number }[];
      markingGuide: string;
      marks: number;
    };

export const questions: Question[] = [
  {
    id: 1,
    type: "mcq",
    prompt:
      "The following is an extract from the equity section of Ink Co at 31 December 20X0: Share capital ($1 shares) $100,000; Share premium $50,000. During the year ended 31 December 20X1, Ink issued 100,000 $1 ordinary shares for $4 each. What was the balance on the share premium account at 31 December 20X1?",
    options: [
      { key: "A", text: "$50,000" },
      { key: "B", text: "$350,000" },
      { key: "C", text: "$450,000" },
      { key: "D", text: "$150,000" },
    ],
    correct: "B",
    explanation:
      "Dr Cash 400,000 / Cr Share capital 100,000 / Cr Share premium 300,000. Closing premium = 50,000 + 300,000 = $350,000.",
  },
  {
    id: 2,
    type: "multi",
    prompt: "Which TWO of the following errors would result in a trial balance imbalance?",
    options: [
      { key: "A", text: "Discounts received balance was listed as a debit on the trial balance" },
      {
        key: "B",
        text: "Dividend paid ledger balance of $970 was recorded in the trial balance as $790",
      },
      {
        key: "C",
        text: "A contra settlement was recorded in the receivables and payables ledgers but not in the control accounts",
      },
      { key: "D", text: "Capital expenditure was posted to repairs" },
    ],
    correct: ["A", "B"],
    explanation:
      "Discounts received should be a credit (not debit) balance. The dividend paid balance has been transposed when listed in the trial balance.",
  },
  {
    id: 3,
    type: "numeric",
    prompt:
      "A business paid insurance premiums of $12,500 during the year ended 30 June 20X3. At 30 June 20X2 there was a prepayment of $600 and at 30 June 20X3 a prepayment of $800. What was the insurance expense for the year?",
    correct: 12300,
    unit: "$",
    explanation: "$12,500 + $600 – $800 = $12,300.",
  },
  {
    id: 4,
    type: "numeric",
    prompt:
      "At 30 September 20X3, a business wrote off two debts of $750 and $1,135. It also required an allowance for receivables of $6,675. The allowance at 1 October 20X2 was $7,650. What was the irrecoverable debt expense?",
    correct: 910,
    unit: "$",
    explanation: "$750 + $1,135 – ($7,650 – $6,675) = $910.",
  },
  {
    id: 5,
    type: "mcq",
    prompt:
      "A sole trader purchased a machine for $750 for long-term use, but posted: Dr Repairs expense $750 / Cr Bank $750. What type of error is this?",
    options: [
      { key: "A", text: "Extraction error" },
      { key: "B", text: "Error of omission" },
      { key: "C", text: "Error of commission" },
      { key: "D", text: "Error of principle" },
    ],
    correct: "D",
    explanation: "Error of principle — an expense account was debited instead of an asset account.",
  },
  {
    id: 6,
    type: "mcq",
    prompt: "Which of the following statements in relation to bank reconciliations is true?",
    options: [
      { key: "A", text: "Unpresented cheques are added to the balance on the bank statement" },
      {
        key: "B",
        text: "Dishonoured cheques from customers are adjusted for by debiting the cash book",
      },
      { key: "C", text: "Unrecorded direct debits are adjusted for by crediting the cash book" },
      { key: "D", text: "Bank charges on the bank statement but not in the cash book are ignored" },
    ],
    correct: "C",
    explanation: "An unrecorded direct debit is a payment — credit the cash book to record it.",
  },
  {
    id: 7,
    type: "numeric",
    prompt:
      "Slouch Co bought a building on 1 January 20X2 for $400,000, depreciated over 50 years straight-line. On 31 December 20X9 it was revalued to $850,000. What was the revaluation surplus recorded in OCI?",
    correct: 514000,
    unit: "$",
    explanation:
      "Accumulated dep’n = 400,000/50 × 8 = 64,000. Carrying amount = 336,000. Surplus = 850,000 – 336,000 = $514,000.",
  },
  {
    id: 8,
    type: "mcq",
    prompt:
      "Opening receivables $65,000. Cash received $182,500, irrecoverable debts $1,250 written off, contra of $1,700 with a payable, closing receivables $68,500. What were credit sales?",
    options: [
      { key: "A", text: "$188,950" },
      { key: "B", text: "$181,950" },
      { key: "C", text: "$186,000" },
      { key: "D", text: "$187,250" },
    ],
    correct: "A",
    explanation:
      "Sales = 182,500 + 1,250 + 1,700 + 68,500 – 65,000 = $188,950 (balancing figure in receivables control).",
  },
  {
    id: 9,
    type: "mcq",
    prompt:
      "Jake’s bank statement shows an overdrawn balance of $865. Unpresented cheques $265. Bank wrongly debited $325 from Jake instead of June. Bank charges of $35 not recorded. What is the corrected cash book balance?",
    options: [
      { key: "A", text: "$805 debit" },
      { key: "B", text: "$805 credit" },
      { key: "C", text: "$770 credit" },
      { key: "D", text: "$770 debit" },
    ],
    correct: "B",
    explanation:
      "Bank: (865) + 265 unpresented – 325 error in bank’s favour = (805). Cash book = $805 credit (overdrawn).",
  },
  {
    id: 10,
    type: "mcq",
    prompt: "Which of the following statements is NOT true?",
    options: [
      { key: "A", text: "The extended trial balance is not a book of prime entry" },
      { key: "B", text: "Only cash purchases are recorded in the purchases day book" },
      {
        key: "C",
        text: "Contra entries with credit customers who are also suppliers affect both ledger balances",
      },
      {
        key: "D",
        text: "Settlement discount received is included as part of a trade payables’ control account",
      },
    ],
    correct: "B",
    explanation: "Credit purchases — not cash purchases — are recorded in the purchases day book.",
  },
  {
    id: 11,
    type: "mcq",
    prompt:
      "A sales-tax registered business makes sales of $2,500 (excl. tax) and buys goods for $3,300 (incl. tax). Sales tax rate 10%. Net effect on the sales tax account?",
    options: [
      { key: "A", text: "$50 Dr" },
      { key: "B", text: "$50 Cr" },
      { key: "C", text: "$80 Cr" },
      { key: "D", text: "$80 Dr" },
    ],
    correct: "A",
    explanation:
      "Output tax (Cr) = 2,500 × 10% = 250. Input tax (Dr) = 3,300 × 10/110 = 300. Net = $50 Dr.",
  },
  {
    id: 12,
    type: "mcq",
    prompt:
      "Inventory cost $300. Needs $75 to repair. After repair could sell for $280. At what value should it be presented?",
    options: [
      { key: "A", text: "$300" },
      { key: "B", text: "$280" },
      { key: "C", text: "$225" },
      { key: "D", text: "$205" },
    ],
    correct: "D",
    explanation: "NRV = 280 – 75 = $205. IAS 2: lower of cost ($300) and NRV ($205).",
  },
  {
    id: 13,
    type: "mcq",
    prompt: "Which of the following statements is true?",
    options: [
      { key: "A", text: "Accumulated depreciation is a debit balance" },
      { key: "B", text: "Depreciation expense account is a credit balance" },
      { key: "C", text: "The revaluation surplus account balance is always a credit balance" },
      { key: "D", text: "The revaluation surplus account balance is always a debit balance" },
    ],
    correct: "C",
    explanation: "Any balance on the revaluation surplus account is always a credit balance.",
  },
  {
    id: 14,
    type: "mcq",
    prompt:
      "Anchor Co is being sued by an employee. Lawyers say 30% chance of losing and paying $250,000. Correct treatment?",
    options: [
      { key: "A", text: "Ignore in the financial statements" },
      { key: "B", text: "Disclose the issue and estimated damages" },
      { key: "C", text: "Provide $250,000" },
      { key: "D", text: "Provide $75,000" },
    ],
    correct: "B",
    explanation:
      "Outflow not probable, so no provision. But possible (30%) — disclose as a contingent liability.",
  },
  {
    id: 15,
    type: "mcq",
    prompt:
      "Sole trader has not yet accounted for a settlement discount received of $150. After correction, which is true?",
    options: [
      { key: "A", text: "Gross profit and net profit increase by $150" },
      { key: "B", text: "Gross profit and net profit decrease by $150" },
      { key: "C", text: "Gross profit unaffected; net profit increases by $150" },
      { key: "D", text: "Gross profit unaffected; net profit decreases by $150" },
    ],
    correct: "C",
    explanation:
      "Settlement discount received is sundry income — doesn’t affect gross profit, only net profit (+$150).",
  },
  {
    id: 16,
    type: "mcq",
    prompt: "Which of the following is NOT capitalised as part of the cost of an asset?",
    options: [
      { key: "A", text: "Electrical/fitting installation work of $5,000" },
      { key: "B", text: "Delivery fee of $750" },
      { key: "C", text: "$1,000 four-year warranty for ongoing repairs" },
      { key: "D", text: "$2,500 incurred testing the machine" },
    ],
    correct: "C",
    explanation:
      "A four-year warranty is written off as an expense over the warranty period (prepayment for unexpired portion).",
  },
  {
    id: 17,
    type: "mcq",
    prompt:
      "Which of these statements are INCORRECT? (1) A balanced TB proves there are no errors. (2) Assets are debits. (3) Expenses are credits. (4) Liabilities are credits.",
    options: [
      { key: "A", text: "(2) and (4)" },
      { key: "B", text: "(4) and (1)" },
      { key: "C", text: "(1) and (3)" },
      { key: "D", text: "(2) and (3)" },
    ],
    correct: "C",
    explanation: "(1) A balanced TB may hide errors. (3) Expenses are debit balances.",
  },
  {
    id: 18,
    type: "mcq",
    prompt:
      "Smyth Co: Revenue $1,081,250; Cost of sales $(432,500); Operating profit $78,400. What is the gross profit margin?",
    options: [
      { key: "A", text: "7.2%" },
      { key: "B", text: "40%" },
      { key: "C", text: "60%" },
      { key: "D", text: "18.1%" },
    ],
    correct: "C",
    explanation: "GP = 1,081,250 – 432,500 = 648,750. Margin = 648,750 / 1,081,250 = 60%.",
  },
  {
    id: 19,
    type: "mcq",
    prompt:
      "Ga Co: Ordinary share capital (50c shares) $200,000. Interim dividend of 30c/share paid 31 Jan 20X4. Final dividend of 45c/share proposed 31 July 20X4. Year end 30 June 20X4. Charge to retained earnings?",
    options: [
      { key: "A", text: "$60,000" },
      { key: "B", text: "$120,000" },
      { key: "C", text: "$300,000" },
      { key: "D", text: "$150,000" },
    ],
    correct: "B",
    explanation:
      "400,000 shares (200,000/0.50). Interim = 400,000 × 0.30 = $120,000. Proposed dividend is non-adjusting (after year end).",
  },
  {
    id: 20,
    type: "numeric",
    prompt:
      "Poker Co paid prior-year tax bill of $170,000 (had provided $160,000). Estimated current-year tax $185,000. What is the tax expense for the year ended 31 July 20X7?",
    correct: 195000,
    unit: "$",
    explanation: "$185,000 + ($170,000 – $160,000 under-provision) = $195,000.",
  },
  {
    id: 21,
    type: "multi",
    prompt: "A Co owns 60% of B Co and 40% of C Co. Which TWO statements are most likely true?",
    options: [
      { key: "A", text: "B Co is an associate of A Co" },
      { key: "B", text: "B Co is a subsidiary of A Co" },
      { key: "C", text: "C Co is a subsidiary of A Co" },
      { key: "D", text: "C Co is an associate of A Co" },
    ],
    correct: ["B", "D"],
    explanation: "Subsidiary > 50% (B Co). Associate 20–50% (C Co).",
  },
  {
    id: 22,
    type: "numeric",
    prompt:
      "Pop offers 6% trade discount and 5% early settlement discount. Weasel buys goods listed at $2,500 (eligible for trade discount). Pop does not expect early settlement. Revenue recognised?",
    correct: 2350,
    unit: "$",
    explanation: "$2,500 × 94% = $2,350. Settlement discount not deducted as not expected.",
  },
  {
    id: 23,
    type: "numeric",
    prompt:
      "Car bought 1 Jan 20X0 for $5,000; SL depreciation 25% p.a. Sold 31 Dec 20X2 for $500. Profit/(loss) on disposal? (enter loss as negative)",
    correct: -750,
    unit: "$",
    explanation:
      "Dep = 1,250/yr. CA at disposal = 5,000 – 3 × 1,250 = 1,250. Loss = 500 – 1,250 = $(750).",
  },
  {
    id: 24,
    type: "numeric",
    prompt:
      "Opening tax liability $130,000. P&L tax charge $145,000. Closing tax liability $140,000. Cash outflow for income tax?",
    correct: 135000,
    unit: "$",
    explanation: "130,000 + 145,000 – 140,000 = $135,000 paid.",
  },
  {
    id: 25,
    type: "mcq",
    prompt:
      "Raul (FIFO): opening 48 units total $540. 12 Aug: 50 units @ $11.50; 23 Aug: 80 units @ $11.40. 25 Aug: sold 90 units. Value of inventory at 31 Aug 20X5?",
    options: [
      { key: "A", text: "$1,000.00" },
      { key: "B", text: "$1,002.05" },
      { key: "C", text: "$1,003.20" },
      { key: "D", text: "$1,004.00" },
    ],
    correct: "D",
    explanation: "Closing units = 88: 80 @ $11.40 = $912 + 8 @ $11.50 = $92. Total $1,004.",
  },
  {
    id: 26,
    type: "mcq",
    prompt:
      "Forth Co year-end 31 Dec 20X1. Which are NOT adjusting? (1) Major customer bankrupt 3 Jan. (2) Inventory cost $3,000 sold for $2,000 on 5 Jan. (3) Fire destroyed warehouse 6 Jan. (4) Dividend declared and paid 10 Jan.",
    options: [
      { key: "A", text: "(1) and (3)" },
      { key: "B", text: "(2) and (4)" },
      { key: "C", text: "(1) and (2)" },
      { key: "D", text: "(3) and (4)" },
    ],
    correct: "D",
    explanation: "(3) and (4) do not provide info about year-end conditions — non-adjusting.",
  },
  {
    id: 27,
    type: "mcq",
    prompt:
      "Sublet office. Cash received in year $83,700. 30/6/X4: arrears $3,800, advance $2,400. 30/6/X5: arrears $4,700, advance $3,000. Rental income for y/e 30/6/X5?",
    options: [
      { key: "A", text: "$84,000" },
      { key: "B", text: "$83,400" },
      { key: "C", text: "$80,600" },
      { key: "D", text: "$86,800" },
    ],
    correct: "A",
    explanation: "2,400 + 83,700 + 4,700 – 3,800 – 3,000 = $84,000.",
  },
  {
    id: 28,
    type: "numeric",
    prompt:
      "Jinx Co began developing a new console 1 Jan 20X1, spending $1m/month. Criteria for capitalisation met on 1 Oct 20X1. How much can be capitalised in y/e 31 Dec 20X1?",
    correct: 3000000,
    unit: "$",
    explanation: "Oct, Nov, Dec → 3 × $1m = $3,000,000.",
  },
  {
    id: 29,
    type: "mcq",
    prompt: "Based on the IASB Conceptual Framework, which best defines an asset?",
    options: [
      { key: "A", text: "A present obligation arising from a past event" },
      { key: "B", text: "An obligation that will arise from a future event" },
      {
        key: "C",
        text: "A present economic resource controlled by the entity as a result of past events",
      },
      { key: "D", text: "A resource controlled by an entity that will arise from a future event" },
    ],
    correct: "C",
    explanation:
      "An asset is a present economic resource controlled by the entity as a result of past events.",
  },
  {
    id: 30,
    type: "mcq",
    prompt:
      "Hatch Co disposed of a vehicle (CA $5,000) for cash of $3,000 (cost $9,000). What goes under Investing Activities?",
    options: [
      { key: "A", text: "Loss on disposal $2,000 and cash inflow $3,000" },
      { key: "B", text: "Cash inflow of sale proceeds $3,000 only" },
      { key: "C", text: "Loss on disposal $2,000 only" },
      { key: "D", text: "Nothing relevant for investing" },
    ],
    correct: "B",
    explanation:
      "Only the $3,000 cash inflow is investing. Loss on disposal is an operating activities adjustment.",
  },
  {
    id: 31,
    type: "mcq",
    prompt:
      "For a sales-tax-registered business, which is true? (1) Sales tax is always a liability. (2) Sales tax is always an asset. (3) Revenue is recorded net of sales tax. (4) Sales tax on purchases is a P&L expense.",
    options: [
      { key: "A", text: "(4) only" },
      { key: "B", text: "(2) and (4)" },
      { key: "C", text: "(1) and (3)" },
      { key: "D", text: "(3) only" },
    ],
    correct: "D",
    explanation:
      "Only (3) is true. Sales tax can be a liability or an asset; input tax on purchases is recoverable, not an expense.",
  },
  {
    id: 32,
    type: "mcq",
    prompt:
      "James overstated a year-end accrual. After correction, how are net profit and net assets affected?",
    options: [
      { key: "A", text: "Net profit increased; Net assets increased" },
      { key: "B", text: "Net profit increased; Net assets decreased" },
      { key: "C", text: "Net profit decreased; Net assets increased" },
      { key: "D", text: "Net profit decreased; Net assets decreased" },
    ],
    correct: "A",
    explanation: "Reducing accrual ↓ expenses → profit ↑; ↓ liabilities → net assets ↑.",
  },
  {
    id: 33,
    type: "mcq",
    prompt: "Gross profit margin rose from 9% to 16%. Which might explain this?",
    options: [
      { key: "A", text: "Higher sales volume in the current year" },
      { key: "B", text: "Higher prompt-payment discounts received" },
      { key: "C", text: "Higher levels of inventory obsolescence" },
      { key: "D", text: "Change in product mix sold" },
    ],
    correct: "D",
    explanation:
      "Volume alone doesn’t change margin. Settlement discount received is sundry income. Obsolescence raises cost of sales (↓ margin). A change in mix can shift margin.",
  },
  {
    id: 34,
    type: "mcq",
    prompt:
      "Beeb Co: draft profit after tax $100,000. Share capital $50,000 of 50c shares. Dividend of 30c/share paid. What is profit after tax after accounting for this?",
    options: [
      { key: "A", text: "$100,000" },
      { key: "B", text: "$70,000" },
      { key: "C", text: "$75,000" },
      { key: "D", text: "$85,000" },
    ],
    correct: "A",
    explanation: "Dividends are not an expense — no profit impact.",
  },
  {
    id: 35,
    type: "mcq",
    prompt: "Which one is NOT true regarding subsidiaries and associates in group accounts?",
    options: [
      { key: "A", text: "Goodwill is not recognised when an investment in an associate is made" },
      { key: "B", text: "Goodwill is not calculated when an investment in a subsidiary is made" },
      { key: "C", text: "Non-controlling interests are not recognised for an associate" },
      { key: "D", text: "Non-controlling interests are not recognised for a subsidiary" },
    ],
    correct: "B",
    explanation: "Goodwill IS calculated when acquiring a subsidiary.",
  },
  {
    id: 36,
    type: "long",
    section: "B",
    title: "Poodle Group consolidated statement of financial position extracts",
    marks: 15,
    prompt:
      "On 1 January 20X1, Poodle acquired 80% of the ordinary shares of Setter for $270,000.\n\nStatements of financial position as at 30 June 20X4:\n\nPoodle: property, plant and equipment $450,000; investments $300,000; inventories $75,000; trade and other receivables $32,000; cash and cash equivalents $3,000; issued share capital $100,000; share premium $20,000; retained earnings $490,000; loans $150,000; trade and other payables $100,000.\n\nSetter: property, plant and equipment $321,825; inventories $45,500; trade and other receivables $43,175; issued share capital $50,000; share premium $10,000; retained earnings $250,500; loans $17,500; trade and other payables $71,425; bank overdraft $11,075.\n\nRelevant information:\n- At acquisition, Setter's retained earnings were $157,500 and the fair value of the non-controlling interest was $63,500.\n- At acquisition, the fair value of land owned by Setter exceeded its carrying amount by $100,000. The land was still owned at 30 June 20X4.\n- During the year, Poodle sold goods to Setter for $20,000 at a mark-up on cost of 25%. All goods remained in Setter's inventory at year end. The sale was on credit and unpaid at 30 June 20X4.",
    requirements: [
      {
        label: "(a)",
        marks: 8.5,
        text: "Calculate the consolidated amounts for property, plant and equipment; inventories; receivables; retained earnings; and payables.",
      },
      {
        label: "(b)",
        marks: 1,
        text: "Choose the correct calculation of investments for the consolidated statement of financial position: (i) $300,000 + $270,000; (ii) $300,000 - $270,000; (iii) $300,000.",
      },
      {
        label: "(c)",
        marks: 2,
        text: "Choose the correct formula for goodwill on consolidation from the options in the question PDF.",
      },
      {
        label: "(d)",
        marks: 1.5,
        text: "Choose the correct formula for non-controlling interest from the options in the question PDF.",
      },
      {
        label: "(e)",
        marks: 2,
        text: "State whether these are true or false: goodwill on consolidation is a tangible non-current asset; non-controlling interest is a liability.",
      },
    ],
    markingGuide:
      "Key answers: PPE $871,825; inventories $116,500; receivables $55,175; retained earnings $560,400; payables $151,425. Investments: option (ii), $300,000 - $270,000. Goodwill formula: consideration paid plus fair value of NCI at acquisition less fair value of net assets at acquisition. NCI formula: fair value of NCI at acquisition plus NCI percentage of the post-acquisition change in fair value of net assets. True/false: goodwill as tangible non-current asset is false; NCI as liability is false. Workings include post-acquisition net assets of $93,000, PURP of $4,000, goodwill of $16,000, and NCI of $82,100.",
  },
  {
    id: 37,
    type: "long",
    section: "B",
    title: "Buzzard Co financial statements",
    marks: 15,
    prompt:
      "The trial balance for Buzzard Co as at 30 September 20X6 is:\n\nRevenue $360,250 credit; retained earnings $64,000 credit; purchases $145,380 debit; administrative expenses $67,300 debit; distribution costs $42,815 debit; plant and machinery cost $199,850 debit; plant and machinery accumulated depreciation at 1 October 20X5 $48,000 credit; trade receivables $47,450 debit; allowance for receivables at 1 October 20X5 $2,500 credit; inventory at 1 October 20X5 $20,000 debit; dividend paid $3,000 debit; trade payables $27,795 credit; issued share capital at $1 shares $20,000 credit; income tax $1,000 debit; bank overdraft $2,250 credit.\n\nAdditional information:\n- Inventory at 30 September 20X6 cost $23,500. Included within this are items costing $5,000 which can be sold for only $3,500.\n- The allowance for receivables should be increased to $6,000, with the increase charged as an administrative cost.\n- Plant and machinery is depreciated on a reducing balance basis at 20% per year. Depreciation is charged to cost of sales.\n- The income tax charge based on profit for the year is estimated at $15,000.",
    requirements: [
      {
        label: "(a)",
        marks: 6.5,
        text: "Prepare the statement of profit or loss for Buzzard Co for the year ended 30 September 20X6, including the required calculations for cost of sales, administrative expenses and income tax.",
      },
      {
        label: "(b)",
        marks: 8.5,
        text: "Prepare the statement of financial position of Buzzard Co as at 30 September 20X6, including the required calculations for inventories, receivables and income tax liability.",
      },
    ],
    markingGuide:
      "Profit or loss: revenue $360,250; cost of sales $173,750; gross profit $186,500; administrative expenses $70,800; distribution costs $42,815; profit before tax $72,885; income tax charge $14,000; profit after tax $58,885. Statement of financial position: PPE $121,480; inventories $22,000; receivables $41,450; total assets $184,930; share capital $20,000; retained earnings $119,885; trade and other payables $27,795; income tax liability $15,000; bank overdraft $2,250; total equity and liabilities $184,930. Workings include closing inventory at NRV adjustment, depreciation of $30,370, allowance increase of $3,500, and retained earnings after profit and dividend.",
  },
];

export const EXAM_DURATION_SECONDS = 2 * 60 * 60; // 2 hours
