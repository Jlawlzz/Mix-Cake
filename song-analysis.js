'use strict';

let lhsLowDiff, lhsLowMedDiff, lhsMedDiff, lhsHighMedDiff,
lhsHighDiff, rhsLowDiff, rhsLowMedDiff, rhsMedDiff, rhsHighMedDiff,
rhsHighDiff, lowDiffTotal, lowMedDiffTotal, medDiffTotal,
highMedDiffTotal, highDiffTotal

let lhsDiffs = [ lhsLowDiff, lhsLowMedDiff, lhsMedDiff, lhsHighMedDiff, lhsHighDiff ]
let rhsDiffs = [ rhsLowDiff, rhsLowMedDiff, rhsMedDiff, rhsHighMedDiff, rhsHighDiff ]

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
  rhsDiffs.forEach(function(diff){
    diff = Math.abs(rhs[i]['fft'][cR] - rhs[i + 1]['fft'][cR]);
    cR += 1
  });
}

let findLHSDiff = function(lhs, i){
  let cL = 0;
  lhsDiffs.forEach(function(diff){
    diff = Math.abs(lhs[i][cL] - lhs[i + 1][cL]);
    cL += 1
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
