'use strict';

let lhsLowDiff, lhsLowMedDiff, lhsMedDiff, lhsHighMedDiff, lhsHighDiff,
    rhsLowDiff, rhsLowMedDiff, rhsMedDiff, rhsHighMedDiff, rhsHighDiff,
    lowDiffTotal, lowMedDiffTotal, medDiffTotal, highMedDiffTotal, highDiffTotal;

let resetParams = function(){
  lowDiffTotal = 0;
  lowMedDiffTotal = 0;
  medDiffTotal = 0;
  highMedDiffTotal = 0;
  highDiffTotal = 0;
};

let findDiff = function(ref, unknown) {

  let lhs = JSON.parse(ref[1]);
  let id = JSON.parse(ref[0]);
  let rhs = unknown;
  let lhsDiff = [];
  let rhsDiff = [];

  resetParams();

  for ( let i = 0; i < 200; i++ ) {

    findRHSDiff(rhs, i);

    findLHSDiff(lhs, i);

    findTotalDiff();
  };

  let avgDiff = findAvgDiffs();
  console.log(id);
  console.log(avgDiff);
  return {'id': id, 'diff': avgDiff};
}

let findRHSDiff = function(rhs, i){
  let cR = 0;
  [rhsLowDiff, rhsLowMedDiff, rhsMedDiff, rhsHighMedDiff, rhsHighDiff].forEach(function(diff){
    cR += 1
    diff = Math.abs(rhs[i]['fft'][c] - rhs[i + 1]['fft'][c]);
  });
}

let findLHSDiff = function(lhs, i){
  let cL = 0;
  [lhsLowDiff, lhsLowMedDiff, lhsMedDiff, lhsHighMedDiff, lhsHighDiff].forEach(function(diff){
    cL += 1
    diff = Math.abs(lhs[i]['fft'][c] - lhs[i + 1]['fft'][c]);
  });
}

let findTotalDiff = function(){
  lowDiffTotal += (rhsLowDiff - lhsLowDiff)
  lowMedDiffTotal += (rhsLowMedDiff - lhsLowMedDiff)
  medDiffTotal += (rhsMedDiff - lhsMedDiff)
  highMedDiffTotal += (rhsHighMedDiff - lhsHighMedDiff)
  highDiffTotal += (rhsHighDiff - lhsHighDiff)
}

let findAvgDiffs = function(){
  let results =  [((lowDiffTotal)/200),
                  ((lowMedDiffTotal)/200),
                  ((medDiffTotal)/200),
                  ((highMedDiffTotal)/200),
                  ((highDiffTotal)/200)];
  let diff = 0;
  results.forEach(function(result){
    diff += Math.abs(result);
  })
  return diff;
}

module.exports = findDiff;
