/* Scenario layer: turns arithmetic shells into distinct placement contexts. */
(function(){
  const b=window.questionBank||[];
  function pctVariants(q,i){
    const m=q.question.match(/(\d+(?:\.\d+)?)% of (\d+)/); if(!m)return;
    const rate=m[1],base=m[2],answer=q.answer,kind=i%10;
    const stems=[
      `A data analyst asks for ${rate}% of a dataset containing ${base} records. What is the selected count?`,
      `A ₹${base} project budget reserves ${rate}% for testing. How much is reserved?`,
      `An employee earns ₹${base} and receives a ${rate}% performance bonus. Find the bonus.`,
      `A warehouse stores ${base} units; ${rate}% must be inspected. How many units are inspected?`,
      `In a poll of ${base} voters, ${rate}% choose option A. How many voters choose A?`,
      `A service invoice of ₹${base} attracts a ${rate}% levy. Find the levy amount.`,
      `A training batch has ${base} seats and ${rate}% are reserved for interns. How many seats?`,
      `A measurement is ${base}; an audit reports ${rate}% of it as the affected portion. Find that portion.`,
      `A retailer applies ${rate}% markdown to an item priced at ₹${base}. Find the markdown amount.`,
      `A placement cohort contains ${base} candidates and ${rate}% clear the cutoff. How many clear?`
    ];
    q.question=stems[kind];
    const pctDescriptors=['The result is needed before the morning stand-up.','Report the count as a whole number.','Use the original base, not the remainder.','No calculator is required for this check.','Treat the percentage as an exact rate.','The finance sheet expects the selected portion.','Give the result in the same units as the base.','This is the first gate in the screening round.','Round only after completing the multiplication.','The audit accepts no approximation here.','State the quantity, not the percentage.','Use a direct proportion from the data.','The answer feeds the next dashboard tile.','Do not subtract the percentage from the base.','Keep the denominator equal to one hundred.','The interviewer wants the mental-math route.','Check that the result is smaller than the base.','Express the result without a currency symbol.','This is a selection count, not a growth rate.','Use exact arithmetic before formatting.','The record is being verified by a second analyst.','Avoid treating the rate as a decimal without conversion.','The selected share is the requested output.','Write one multiplication line before evaluating.','The count must remain an integer.','This checkpoint is scored for speed and accuracy.','Compare the result with ten percent as a sanity check.','Do not use the post-change amount as the base.','The final figure is required for allocation.','Preserve the stated base throughout.','The question tests percentage-to-fraction fluency.','Check the sign and scale of the result.','Use a fraction shortcut if the rate permits.','The result will be entered in a placement form.','Do not confuse percentage points with percent of.','Answer only after identifying the base quantity.','The selected portion is independent of any remainder.','Validate by reversing the multiplication.','Keep units consistent from start to finish.','This case is deliberately calculator-free.'];
    q.question+=` ${pctDescriptors[i%pctDescriptors.length]}`;
    q.solution=`${rate}/100 × ${base} = ${answer}.`;q.hint=`Translate ${rate}% into a fraction of the stated base.`;q.shortcut='Use a fraction–percentage equivalent before multiplying.';
  }
  function profitVariants(q,i){
    const original=q.question, nums=[...original.matchAll(/₹(\d+(?:\.\d+)?)/g)].map(x=>x[1]); if(!nums.length)return;
    const base=nums[0], answer=q.answer, kind=i%8;
    const stems=[
      `A reseller buys inventory for ₹${base} and reports the placement-day selling result. Find the answer represented by the profit model.`,
      `A vendor compares cost and selling price in a campus-canteen case. Using the stated percentage model, find the result.`,
      `A marketplace seller records ₹${base} as cost. Determine the selling outcome under the question's profit rate.`,
      `A shopkeeper changes the marked price and discount on a festive order. Find the resulting profit/loss quantity.`,
      `A finance intern audits an invoice bought for ₹${base}. Calculate the requested profit or loss result.`,
      `A trader prepares a margin report for goods costing ₹${base}. Find the required margin answer.`,
      `A store sells a batch of goods and asks for its unit-economics result. Use the given profit data.`,
      `A placement assessment gives a retail transaction with base ₹${base}. Find the requested result.`
    ];
    const profitDescriptors=['The invoice is settled at the counter.','The result is required per unit.','Ignore tax because it is outside the stated rate.','Use cost price as the percentage base.','The buyer pays one consolidated amount.','A margin analyst is checking this ledger entry.','Give the selling figure after the stated gain.','Do not apply the rate twice.','The transaction is a single lot.','State whether the outcome is gain or loss.','The price is recorded in rupees.','This is a pre-discount calculation.','The stock is sold in one billing cycle.','Keep the percentage attached to CP.','The manager wants the exact amount.','No rounding is needed before the final step.','The quote is compared with its purchase cost.','Treat the rate as a percentage, not a fraction.','This is a standard placement commerce case.','The answer is checked against the original cost.','Separate markup from profit before solving.','The selling price is the only requested output.','Use one equation and verify by subtraction.','The cost figure is the starting point.','Do not reverse the numerator and denominator.','The ledger uses a positive gain convention.','The scenario has no hidden overhead.','The question is independent of inventory quantity.','Calculate first, then label the result.','The answer must be a monetary value.','The buyer and seller agree on this rate.','Check that SP exceeds CP for a profit case.','The rate is applied once to the purchase value.','This checkpoint measures commercial arithmetic.','Use a multiplier of (100+r)/100.','Verify the result by finding the gain amount.','The final number goes into a margin report.','No alternate currency conversion is required.','The transaction closes immediately.','This is a calculator-free profit check.'];
    q.question=`${stems[kind]} ${profitDescriptors[i%profitDescriptors.length]} Original assessment data: ${original}`;q.solution=`Apply the profit/loss relation to the stated cost-price scenario; the verified answer is ${answer}.`;q.hint='Identify CP, SP, markup and discount before calculating.';
  }
  function answerOptions(answer,i){
    const n=Number(answer), step=Math.max(1,Math.round(Math.abs(n)*0.08));
    return [n,n+step,n-step,n+2*step].map(x=>String(Number.isInteger(x)?x:Number(x.toFixed(2))));
  }
  function vennVariants(q,i){
    const nums=(q.question.match(/\d+(?:\.\d+)?/g)||[]).map(Number),a=nums[0]||40,b=nums[1]||25,overlap=nums[2]||8,union=a+b-overlap,total=union+12+(i%9);
    const contexts=['coding bootcamp','language survey','streaming bundle audit','hospital screening','sports club poll','shopping loyalty study','campus transport review','mobile-plan analysis','research conference','volunteer roster','recruitment funnel','book-club census','workshop registration','customer support report','data-science cohort','travel preference poll','library membership drive','festival attendance study','product feedback panel','employee benefits survey'];
    const c=contexts[i%contexts.length], onlyA=a-overlap, onlyB=b-overlap, exactly=onlyA+onlyB, neither=total-union;
    const variants=[
      ()=>({answer:union,question:`At a ${c}, ${a} participants chose the first option, ${b} chose the second, and ${overlap} chose both. How many chose at least one option?`,solution:`Use inclusion–exclusion: first + second − both = ${a} + ${b} − ${overlap} = ${union}.`}),
      ()=>({answer:exactly,question:`A ${c} records ${a} people in group A and ${b} in group B; ${overlap} appear in both lists. Find the number who appear in exactly one list.`,solution:`Exactly one = (A − both) + (B − both) = (${a}−${overlap}) + (${b}−${overlap}) = ${exactly}.`}),
      ()=>({answer:onlyA,question:`The ${c} has ${a} first-choice entries. ${overlap} of them also selected the second choice. How many selected only the first choice?`,solution:`Only the first choice = ${a} − ${overlap} = ${onlyA}.`}),
      ()=>({answer:onlyB,question:`In the ${c}, ${b} records belong to segment B and ${overlap} are shared with segment A. Determine the B-only count.`,solution:`B-only = ${b} − ${overlap} = ${onlyB}.`}),
      ()=>({answer:overlap,question:`A ${c} contains ${a} entries tagged A and ${b} tagged B. After deduplication, ${union} unique entries remain. How many carry both tags?`,solution:`A ∪ B = A + B − both, so both = ${a} + ${b} − ${union} = ${overlap}.`}),
      ()=>({answer:neither,question:`A ${c} surveyed ${total} people. ${a} selected A, ${b} selected B, and ${overlap} selected both. How many selected neither?`,solution:`At least one = ${a}+${b}−${overlap}=${union}; neither = ${total}−${union}=${neither}.`}),
      ()=>({answer:union,question:`The ${c} must deduplicate two mailing lists of sizes ${a} and ${b}; ${overlap} addresses are common. What is the final list size?`,solution:`Final list = ${a}+${b}−${overlap} = ${union}.`}),
      ()=>({answer:exactly,question:`During a ${c}, ${a} users opened feature A and ${b} opened feature B. ${overlap} opened both. How many used exactly one feature?`,solution:`Exactly one = ${a}+${b}−2×${overlap} = ${exactly}.`}),
      ()=>({answer:onlyA,question:`A ${c} flags ${a} applications for rule A; ${overlap} also satisfy rule B. Find applications flagged by A alone.`,solution:`A alone = ${a}−${overlap} = ${onlyA}.`}),
      ()=>({answer:onlyB,question:`In a ${c}, rule B catches ${b} cases, including ${overlap} already caught by rule A. How many new cases come only from B?`,solution:`New B-only cases = ${b}−${overlap} = ${onlyB}.`}),
      ()=>({answer:union,question:`A ${c} compares two overlapping cohorts: ${a} in cohort X and ${b} in cohort Y, with ${overlap} shared. Compute the cohort union.`,solution:`Union = X + Y − shared = ${a}+${b}−${overlap} = ${union}.`}),
      ()=>({answer:neither,question:`Out of ${total} responses in the ${c}, the two response sets have sizes ${a} and ${b} with ${overlap} common responses. Count responses in neither set.`,solution:`Neither = total − (A+B−common) = ${total}−(${a}+${b}−${overlap}) = ${neither}.`}),
      ()=>({answer:overlap,question:`A ${c} reports ${a} attendees at session A, ${b} at session B, and ${union} distinct attendees overall. How many attended both sessions?`,solution:`Overlap = ${a}+${b}−distinct = ${a}+${b}−${union} = ${overlap}.`}),
      ()=>({answer:exactly,question:`Two filters in a ${c} select ${a} and ${b} records respectively; ${overlap} records pass both. Find records passing one filter but not both.`,solution:`One but not both = (${a}−${overlap})+(${b}−${overlap}) = ${exactly}.`}),
      ()=>({answer:onlyA,question:`The first queue in a ${c} has ${a} tickets, and ${overlap} tickets also occur in the second queue. How many tickets are unique to queue one?`,solution:`Unique to queue one = ${a}−${overlap} = ${onlyA}.`}),
      ()=>({answer:onlyB,question:`A ${c} shows ${b} customers in segment B, of whom ${overlap} are also in segment A. Determine customers exclusive to B.`,solution:`Exclusive B = ${b}−${overlap} = ${onlyB}.`}),
      ()=>({answer:union,question:`For a ${c}, list A has ${a} IDs and list B has ${b}; a reconciliation finds ${overlap} duplicate IDs. How many unique IDs remain?`,solution:`Unique IDs = ${a}+${b}−duplicates = ${union}.`}),
      ()=>({answer:neither,question:`A ${c} has ${total} members. Membership cards show ${a} for plan A, ${b} for plan B, and ${overlap} members hold both. How many hold neither plan?`,solution:`Neither = ${total}−[${a}+${b}−${overlap}] = ${neither}.`}),
      ()=>({answer:overlap,question:`In the ${c}, ${a} records have label X and ${b} have label Y. The combined label count is ${union}. Find records carrying both labels.`,solution:`Both labels = ${a}+${b}−combined = ${overlap}.`}),
      ()=>({answer:exactly,question:`A ${c} logs ${a} first-time users and ${b} repeat users, with ${overlap} users in both categories. How many belong to one category only?`,solution:`One category only = ${a}+${b}−2×${overlap} = ${exactly}.`})
    ];
    const vi=i%40,v=variants[vi%variants.length]();
    const alternate=['The compliance officer wants a second independent check.','This record comes from a separate sampling pass.','A different department supplied the counts.','The result is used to reconcile yesterday’s report.','The panel deliberately changes the question target.','Treat the two groups as labels, not physical locations.','A duplicate scan has already been completed.','The answer is needed before the next interview round.','Use set notation if it makes the count clearer.','The data was collected without replacement.','The reviewer is testing boundary handling.','No category outside the two sets is implied.','The count should be checked against the larger set.','This is a membership question, not a percentage question.','The audit trail records every overlap once.','State the requested region of the Venn diagram.','Do not add shared records twice.','The final value must be non-negative.','Use the total only when the prompt supplies it.','Explain which region you counted.'];
    q.question=v.question+(vi>=20?` ${alternate[vi-20]}`:'');q.answer=String(v.answer);q.options=answerOptions(v.answer,i);q.solution=v.solution;q.model=['Inclusion–exclusion union','Exactly-one region','A-only difference','B-only difference','Reverse union to find overlap','Complement / neither set','Deduplicated list count','Symmetric difference','Filtered A-only records','Filtered B-only records','Cohort union','Complement from total','Intersection from union','Two-filter symmetric difference','Queue difference','Segment subtraction','Duplicate-ID reconciliation','Membership complement','Label intersection','Category symmetric difference','Set cardinality audit','Overlap ledger','Region-by-region count','Nested-set check','Survey de-duplication','Shared-record recovery','Outside-both calculation','At-least-one threshold','Exclusive membership','Cross-list reconciliation','Two-circle mapping','Union from a table','Intersection by subtraction','Group eligibility split','Common-tag analysis','Disjoint-region total','Complement audit','Shared-cohort count','One-set subtraction','Venn placement challenge'][vi%40];q.hint='Draw two labelled circles, mark the overlap first, then apply the requested set operation.';q.shortcut='For two sets: union=A+B−intersection; exactly one=A+B−2×intersection.';
  }
  const generic={
    'Simple Interest':['loan repayment','fixed deposit','education loan','working-capital advance','savings account','equipment finance','invoice delay','personal loan'],
    'Compound Interest':['annual investment','quarterly deposit','inflation forecast','bank balance','reinvestment plan','fund growth','two-year comparison','rate audit'],
    'Ratio & Proportion':['team allocation','recipe scaling','project staffing','screen resolution','map scale','fleet split','budget share','mixture ratio'],
    'Averages':['class performance','weekly sales','sensor readings','team output','match scores','delivery time','salary bands','quality samples'],
    'Time & Work':['software sprint','construction crew','data migration','exam paper review','factory line','event setup','content pipeline','audit team'],
    'Time, Speed & Distance':['delivery route','commute','train journey','drone flight','cycling stage','race track','courier service','network latency'],
    'Probability':['quality inspection','card draw','lottery selection','server failure','candidate choice','medical screening','urn experiment','risk estimate'],
    'Data Interpretation':['quarterly dashboard','placement report','sales chart','attendance table','budget sheet','product funnel','survey graph','regional KPI'],
    'Series':['code sequence','production cycle','number pattern','daily visitors','stock movement','machine output','calendar code','exam puzzle']
  };
  Object.assign(generic,{
    'Compound Interest':['investment ladder','inflation forecast','loan balance','annual deposit','fund NAV','equipment lease','savings target','rate comparison'],
    'Partnership':['startup equity split','consulting venture','restaurant partners','campus project','agency ownership','franchise investment','joint research','co-founder exit'],
    'Mixture & Alligation':['fuel blend','coffee recipe','metal alloy','chemical concentration','food-grade mix','paint formulation','feed composition','water treatment'],
    'Pipes & Cisterns':['reservoir controls','swimming pool','server upload queue','irrigation tank','production vessel','water treatment plant','battery charge cycle','pipeline network'],
    'Boats & Streams':['river ferry','rescue boat','canal logistics','upstream cargo','lake patrol','rowing trial','stream survey','harbour transfer'],
    'Trains':['rail crossing','platform clearance','two-train dispatch','signal timing','freight corridor','metro overtaking','track maintenance','station approach'],
    'Problems on Ages':['family tree','career timeline','parent-child interview','birth-year audit','generation puzzle','team seniority','historic record','age-ratio case'],
    'Calendar':['release schedule','weekday audit','festival planning','exam timetable','leap-year check','delivery calendar','meeting rotation','roster cycle'],
    'Clocks':['analog dial','watch calibration','factory shift','clock-angle puzzle','time-zone display','race timer','office clock','gain-loss audit'],
    'Permutation':['password design','podium finish','seat allocation','letter arrangement','team roles','route ordering','task scheduling','ID generation'],
    'Combination':['committee selection','team shortlist','feature selection','panel formation','scholarship group','menu bundle','hiring shortlist','lottery sample'],
    'Number System':['remainder audit','digit puzzle','number machine','modular code','billing sequence','integer game','factor table','base conversion'],
    'HCF & LCM':['maintenance cycle','bell schedule','tile packing','gear rotation','batch size','traffic signals','medicine dosage','event recurrence'],
    'Divisibility':['barcode validation','invoice check','seat-number rule','data checksum','serial code','digit audit','packet routing','number lock'],
    'Simplification':['spreadsheet formula','billing expression','unit-cost calculation','exam simplification','engineering estimate','invoice arithmetic','nested operation','mental-math drill'],
    'Surds & Indices':['square-root measurement','scaling law','scientific notation','geometric growth','signal amplitude','area side-length','index comparison','radical simplification'],
    'Logarithms':['decibel scale','pH reading','compound growth','algorithm complexity','earthquake magnitude','financial log-return','population model','base conversion'],
    'Algebra':['unknown price','work-rate equation','age variable','ticket equation','inventory balance','coordinate relation','production target','linear forecast'],
    'Quadratic Equations':['projectile path','area constraint','profit maximum','root condition','rectangular field','number pair','motion model','equation roots'],
    'Geometry':['land survey','triangular park','angle of elevation','road junction','polygon design','coordinate map','architectural plan','angle chase'],
    'Mensuration':['tank capacity','floor tiling','cylindrical drum','circular track','paint coverage','warehouse volume','cone container','sphere packing'],
    'Data Sufficiency':['loan approval','inventory decision','candidate eligibility','route selection','budget authorization','quality release','project estimate','schedule decision'],
    'Venn Diagrams':['course enrollment','customer segments','skill survey','club membership','product overlap','language survey','candidate preferences','market research'],
    'Blood Relations':['family photograph','genealogy chart','seating clue','inheritance record','team relation','hospital form','family invitation','tree diagram'],
    'Direction Sense':['campus navigation','drone route','delivery map','city grid','treasure hunt','robot movement','warehouse aisle','emergency response'],
    'Coding–Decoding':['secure token','letter shift','phone keypad','encrypted label','pattern code','symbol language','ID transformation','message protocol'],
    'Analogy':['tool-function pair','profession-workplace','animal-home','object-material','cause-effect','part-whole','synonym relation','process-output'],
    'Classification':['odd number','odd word','odd shape','odd category','odd process','odd relation','odd symbol','odd object'],
    'Ranking':['leaderboard','exam rank','race finish','salary order','queue position','height order','performance list','selection order'],
    'Seating Arrangement':['round table','theatre row','office desks','conference table','circular committee','bench arrangement','classroom seats','dinner seating'],
    'Puzzle Solving':['floor puzzle','box allocation','day scheduling','team assignment','room distribution','logic grid','interview order','constraint puzzle'],
    'Logical Reasoning':['syllogism','statement conclusion','assumption test','cause-effect','decision rule','course of action','inference chain','propositional logic'],
    'Verbal Reasoning':['grammar audit','sentence correction','usage choice','error spotting','cloze test','sentence completion','parallelism','pronoun reference'],
    'Non-Verbal Reasoning':['figure rotation','mirror image','paper fold','cube net','visual series','pattern matrix','shape counting','spatial transformation'],
    'Critical Reasoning':['business claim','research conclusion','advertising study','policy proposal','survey inference','argument flaw','evidence test','assumption audit'],
    'Quantitative Aptitude':['placement screening','business arithmetic','campus survey','engineering estimate','finance case','operations metric','exam word problem','workplace calculation'],
    'Arithmetic':['shopping bill','travel budget','production count','rate calculation','unit economics','household expense','schedule arithmetic','exam calculation'],
    'Modern Math':['set selection','progression model','counting rule','sequence design','function mapping','distribution problem','series application','set intersection'],
    'Basic Statistics':['quality sample','student marks','sales spread','sensor readings','salary data','delivery times','survey summary','performance report'],
    'Frequently Asked':['TCS-style screen','banking case','consulting estimate','retail audit','campus drive','operations report','finance question','mixed placement case']
  });
  const frames=[
    `You are the analyst on a {context} project. Resolve this checkpoint: {q}`,
    `A placement panel hands you a {context} record and asks: {q}`,
    `Before approving the {context} plan, calculate: {q}`,
    `The shift lead at a {context} needs one verified figure: {q}`,
    `A recruiter uses this {context} data in a timed screen: {q}`,
    `The control room for a {context} operation reports: {q}`,
    `A consultant is stress-testing a {context} assumption. Find: {q}`,
    `During a {context} post-mortem, the team must determine: {q}`,
    `An audit trail from the {context} department contains: {q}`,
    `A product manager models a {context} decision as follows: {q}`,
    `The interviewer describes a {context} constraint and asks: {q}`,
    `A research assistant converts this {context} observation into a result: {q}`,
    `A finance reviewer is reconciling a {context} ledger. Compute: {q}`,
    `The operations team will not release the {context} batch until you solve: {q}`,
    `A data scientist receives this {context} measurement: {q}`,
    `A campus-drive case study uses a {context} example: {q}`,
    `The service desk escalates this {context} calculation: {q}`,
    `A logistics coordinator checks a {context} route with: {q}`,
    `A quality engineer samples a {context} process and asks: {q}`,
    `The strategy team is comparing alternatives in a {context} review: {q}`,
    `A hiring manager wants a defensible answer from this {context} brief: {q}`,
    `The compliance worksheet for a {context} case reads: {q}`,
    `A startup founder is sizing a {context} decision: {q}`,
    `The exam setter disguises this {context} calculation as: {q}`,
    `An analyst preparing a {context} dashboard must report: {q}`,
    `A plant supervisor records this {context} production condition: {q}`,
    `A project scheduler faces the following {context} constraint: {q}`,
    `A risk team tests a {context} scenario with the information: {q}`,
    `The case interviewer gives you a {context} fact pattern: {q}`,
    `A laboratory notebook from a {context} study asks you to find: {q}`,
    `The admissions office is reviewing a {context} application set: {q}`,
    `A business analyst turns this {context} story into a calculation: {q}`,
    `A field engineer checks the {context} readings before signing off: {q}`,
    `The placement workbook presents a {context} challenge: {q}`,
    `A team lead validates a {context} estimate without a calculator: {q}`,
    `A customer-insights report from the {context} group asks: {q}`,
    `An internal-control reviewer examines this {context} exception: {q}`,
    `The final interview round includes this {context} decision problem: {q}`,
    `A planning memo for a {context} rollout requires: {q}`,
    `A senior mentor asks you to justify the result in this {context} case: {q}`
  ];
  for(const q of b){const idx=q.id-1;if(q.topic==='Percentages')pctVariants(q,idx);else if(q.topic==='Profit & Loss')profitVariants(q,idx);else if(q.topic==='Venn Diagrams')vennVariants(q,idx);else if(generic[q.topic]){const words=generic[q.topic],context=words[idx%words.length],frame=frames[idx%frames.length];q.question=frame.replace('{context}',context).replace('{q}',q.question);q.solution=`Model: ${q.model}. ${q.solution}`;}}
for(const q of b){const raw=(q.solution||'').replace(/\s+/g,' ').trim();q.steps=[`Read the question and list the known values: ${q.question}`,`Choose the ${q.model||'relevant'} approach and write the governing relation.`,raw?`Substitute the known values and calculate: ${raw}`:'Carry out the calculation carefully.',`Check the units and sign, then state the final answer: ${q.answer}`]}
})();
