'use strict';

let lhsLowDiff, lhsLowMedDiff, lhsMedDiff, lhsHighMedDiff, lhsHighDiff,
    rhsLowDiff, rhsLowMedDiff, rhsMedDiff, rhsHighMedDiff, rhsHighDiff,
    lowDiffTotal, lowMedDiffTotal, medDiffTotal, highMedDiffTotal, highDiffTotal

let resetParams = function(){
  lowDiffTotal = 0
  lowMedDiffTotal = 0
  medDiffTotal = 0
  highMedDiffTotal = 0
  highDiffTotal = 0
}

let findDiff = function(ref, unknown) {

  let lhs = JSON.parse(ref[1])
  let id = JSON.parse(ref[0])
  let rhs = unknown
  let lhsDiff = []
  let rhsDiff = []

  resetParams();

  for ( let i = 0; i < 200; i++ ) {

    findRHSDiff(rhs, i)

    findLHSDiff(lhs, i)

    findTotalDiff()
  };

  let avgDiff = findAvgDiffs()
  console.log(id)
  console.log(avgDiff)
  return {'id': id, 'diff': avgDiff}
}

let findRHSDiff = function(rhs, i){
  rhsLowDiff = Math.abs(rhs[i]['fft'][0] - rhs[i + 1]['fft'][0]);
  rhsLowMedDiff = Math.abs(rhs[i]['fft'][1] - rhs[i + 1]['fft'][1]);
  rhsMedDiff = Math.abs(rhs[i]['fft'][2] - rhs[i + 1]['fft'][2]);
  rhsHighMedDiff =Math.abs(rhs[i]['fft'][3] - rhs[i + 1]['fft'][3]);
  rhsHighDiff = Math.abs(rhs[i]['fft'][4] - rhs[i + 1]['fft'][4]);
}

let findLHSDiff = function(lhs, i){
  lhsLowDiff = Math.abs(lhs[i][0] - lhs[i + 1][0]);
  lhsLowMedDiff = Math.abs(lhs[i][1] - lhs[i + 1][1]);
  lhsMedDiff = Math.abs(lhs[i][2] - lhs[i + 1][2]);
  lhsHighMedDiff = Math.abs(lhs[i][3] - lhs[i + 1][3]);
  lhsHighDiff = Math.abs(lhs[i][4] - lhs[i + 1][4]);
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
  let diff = 0
  results.forEach(function(result){
    diff += Math.abs(result)
  })
  return diff
}

module.exports = findDiff;
