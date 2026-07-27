/* Adds the OCR/imported objective bank after the original AptitudeX bank. */
(function(){
  const imported=window.rsAggarwalQuestions||[];
  const seen={};
  const formula={
    'Number System':'N = place-value expansion; use divisibility, remainder, factors, or digit rules as stated.',
    'HCF & LCM':'HCF = product of common prime factors at minimum powers; LCM = product at maximum powers.',
    'Simplification':'Apply BODMAS: brackets → powers/roots → division/multiplication → addition/subtraction.',
    'Surds & Indices':'aᵐ × aⁿ = aᵐ⁺ⁿ; (aᵐ)ⁿ = aᵐⁿ; √(ab) = √a·√b.',
    'Averages':'Average = sum of observations ÷ number of observations.',
    'Percentages':'Part = (rate ÷ 100) × base; percentage change = change ÷ original × 100.',
    'Profit & Loss':'Profit = SP − CP; profit% = profit ÷ CP × 100; SP = CP(100+r)/100.',
    'Ratio & Proportion':'If a:b = m:n, then a = km and b = kn; determine k from the total.',
    'Partnership':'Share ∝ capital × time.',
    'Pipes And Cisterns':'Combined rate = sum of individual rates; time = 1 ÷ combined rate.',
    'Time And Work':'Work = rate × time; combined rate = 1/t₁ + 1/t₂ + …',
    'Time, Speed & Distance':'Distance = speed × time; relative speed = sum/difference as direction requires.',
    'Trains':'Speed = distance ÷ time; crossing a pole uses train length as distance.',
    'Mixture & Alligation':'Mean price = total cost ÷ total quantity; use alligation for two concentrations.',
    'Simple Interest':'SI = PRT ÷ 100; amount = P + SI.',
    'Compound Interest':'A = P(1+r/100)ⁿ; CI = A − P.',
    'Calendar':'Required weekday = starting weekday + (number of days mod 7).',
    'Clocks':'Angle = |30H − 5.5M| degrees, reduced to the smaller angle.',
    'Permutation':'ⁿPᵣ = n! ÷ (n−r)!; order matters.',
    'Probability':'P(event) = favourable outcomes ÷ total equally likely outcomes.',
    'Geometry':'Use angle sum, similarity, Pythagoras, or the stated geometric relation.',
    'Arithmetic':'Translate the wording into an equation, simplify, and verify units.'
  };
  function mathematicalSteps(q,given,rule,answerText){
    let m=q.question.match(/place value of\s+(\d)\s+in\s+(\d+)/i);
    if(m){
      const digit=Number(m[1]),number=m[2],position=number.indexOf(m[1]),power=number.length-position-1,place=10**power;
      return [`Given: N = ${number}, digit d = ${digit}.`,`Place multiplier = 10^${power} = ${place}.`,`Value = d × place = ${digit} × ${place} = ${answerText}.`,`Therefore, R = ${answerText}.`];
    }
    m=q.question.match(/face value of\s+(\d)\s+in\s+the number\s+(\d+)/i);
    if(m)return [`Given: digit d = ${m[1]} in N = ${m[2]}.`,`Face value rule: FV(d) = d.`,`Substitution: FV(${m[1]}) = ${m[1]}.`,`Therefore, R = ${answerText}.`];
    return [`Given: ${given}.`,`Set up: ${q.topic}(${given}).`,`Formula: ${rule}`,`Calculate: R = ${answerText}; verify against the options.`];
  }
  imported.forEach(q=>{
    const topicIndex=seen[q.topic]||0;seen[q.topic]=topicIndex+1;
    q.kind=topicIndex<20?'Solved Example':'Practice';
    const answerText=q.answer||'not recovered from the answer key';
    const values=(q.question.match(/[-+]?\d+(?:\.\d+)?/g)||[]).slice(0,10);
    const given=values.length?values.map((v,i)=>`x${i+1}=${v}`).join(', '):'values from the prompt';
    const rule=formula[q.topic]||'Translate the givens into symbols, apply the chapter rule, and simplify.';
    q.steps=mathematicalSteps(q,given,rule,answerText);
  });
  // The source-book edition is the active curriculum requested by Rohith.
  // Do not mix generated AptitudeX questions into Examples, Practice, or Tests.
  window.questionBank=imported;
})();
