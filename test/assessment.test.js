import Assessment from '../src/assessment'
import countBy from 'lodash/countBy'

describe('The Assessment', () => {

  var assessment = new Assessment();
  assessment.buildAssessment();
  assessment.simulateAssessmentAnswers();

  let reportAfterAnswers = assessment.generateReport();

  it('should have 30 questions', () => {
    // console.log(JSON.stringify(assessment.questionList, null, 4)); // uncomment to log all assessment questions and answers
    expect(assessment.questionList).toHaveLength(30);
  });

  it('should not show the same answer twice', () => {
    let answersUsed = [];
    for (let question of assessment.questionList) {
      for (let option of question.answerOptions) {
        answersUsed.push(option.answer);
      }
    }
    let answerFrequency = countBy(answersUsed);
    // console.log(answerFrequency); // uncomment to log answer frequencies
    expect(Object.values(answerFrequency).every(item => item === 1)).toBe(true);
  }); 

  it('should match each dimension to the other dimensions exactly 2 times', () => {
    let dimensionPairsList = [];
    let dimensionPair = [];
    for (let question of assessment.questionList) {
      for (let option of question.answerOptions) {
        dimensionPair.push(option.dimension);
      }
      dimensionPairsList.push(dimensionPair);
      dimensionPair = [];
    }
    let dimensionPairFrequency = countBy(dimensionPairsList);
    // console.log(dimensionPairFrequency); // uncomment to log dimension pair frequencies
    expect(Object.values(dimensionPairFrequency).every(item => item === 2)).toBe(true);
  });

  it('should provide ipsative questions (two possible answers)', () => {
  // Note: this test covers the functional requirements of the added ipsativeQuestion class.
    for (let question of assessment.questionList) {
      expect(question.answerOptions).toHaveLength(2);  
    }
  });

  describe('when completed', () => {

    it('should provide the results as an object', () => {
      expect(typeof reportAfterAnswers).toBe('object');
    });

    it('should represent the results based on 6 dimensions', () => {
      // console.log(reportAfterAnswers); // uncomment to log assessment report
      expect(Object.keys(reportAfterAnswers).length).toBe(6);
    });
  });
});