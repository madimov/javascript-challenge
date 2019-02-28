/** 
 * Bunch coding challenge
 * Miko Dimov
 * 28/02/2019 
 */

import Dimensions from '../src/dimensions';
import IpsativeQuestion from '../src/ipsativeQuestion';
import shuffle from 'lodash/shuffle'
import random from 'lodash/random'

class Assessment {

/** Represents an assessment, containing needed counters and an array for ipsative questions.*/
constructor() {
	this.questionList = [];
	this.counters = {};
	for (var i = 0; i < Dimensions.length; i++) {
		this.counters[Dimensions[i].name] = { // Generates counters for each dimension provided in '../src/dimensions.js'
			nextAnswerIndex: 0, // Enables non-repetitive use of answer variants for each dimension.
			timesChosen: 0 // The basis for the assessment report.
		};
	};
};

/** Generates all unique pairings of the dimensions provided.*/
generateDimensionPairs() {
	let dimensionPairsList = [];
	let dimensionPair = [];
	for (var i = 0; i < Dimensions.length; i++) {
		for (var j = i+1; j < Dimensions.length; j++) {
			dimensionPair.push(Dimensions[i].name, Dimensions[j].name);
			dimensionPairsList.push(dimensionPair);
			dimensionPair = [];
		};
	};
	return dimensionPairsList;
};

/** Gets a complete list of answer variants for a given dimension.*/
getDimensionAnswers(dimension) {
	return Dimensions.find(o => o.name === dimension).answers;
};

/** Checks if any unused answer variants remain for a given dimension.*/
checkIfUnusedAnswersRemain(dimension, answers) {
	if (answers[this.counters[dimension].nextAnswerIndex + 1] === undefined) {
		return false;
	};
	return true;
};

/** Gets the next unused answer variant for a given dimension.*/
getNextAnswer(dimension, answers) {
	let answer = answers[this.counters[dimension].nextAnswerIndex];
	if (this.checkIfUnusedAnswersRemain(dimension, answers) == true) {
		this.counters[dimension].nextAnswerIndex++;
	} else { 
	/* Extra optional feature: this would not come into play with the required limitations and the 6 current dimensions,
	   but it's a safeguard enabling the reuse of answer variants to allow the assessment to function with more dimensions if desired.
	   It allows going beyond the coding challenge requirement of 30 non-repetitive questions; it's just an idea for enabling expansion.
	   To activate, add an extra dimension to the Dimensions array in '../src/dimensions.js', and uncomment the console warning below. 
	 */
		this.counters[dimension].nextAnswerIndex = 0; 
		
		// console.warn("The " + dimension + " dimension has all its answer variants in use. Please add more variants if adding dimensions (extra feature)"); // uncomment to activate
		// ^ an optional notification for the product team to add more answer variants if adding dimensions, and avoid repetition. 
	};
	
	return answer;
};

/** Generates 2 non-repetitive questions for a given pair of dimensions.*/
generateQuestionsForDimensionPair(dimensionPair) {
	let question1 = new IpsativeQuestion(), question2 = new IpsativeQuestion();
	let questionPair = [question1, question2];
	for (let dimension of dimensionPair) {
		let answers = this.getDimensionAnswers(dimension);
		for (let question of questionPair) {
			let option = {
				dimension: dimension, 
				answer: this.getNextAnswer(dimension, answers) // 2 non-repetitive answer options
			};
			question.answerOptions.push(option);
		};
  	};
  	return questionPair;
};

/** Generates the full text for each of the questions in the assessment.*/
generateQuestionsText() {
	for (let question of this.questionList) {
		question.buildText();
	};
};

/** Randomizes the order of the questions in the assessment.*/
shuffleQuestions() {
	this.questionList = shuffle(this.questionList);
};

/** Builds the assessment by generating shuffled questions for each dimension pair.*/
buildAssessment() {
	let dimensionPairs = this.generateDimensionPairs();
	for (let dimensionPair of dimensionPairs) {
		this.questionList.push(...this.generateQuestionsForDimensionPair(dimensionPair))
	}
	this.generateQuestionsText();
	this.shuffleQuestions();
};

/** Simulates random answers choices (1 or 2) for each question in the assessment.*/
simulateAssessmentAnswers() {
	for (let question of this.questionList) {
		question.answerChoice = random(1,2);
		let dimensionChosen = question.answerOptions[question.answerChoice - 1].dimension; // e.g. converting answer choice 1 to option index 0
		this.counters[dimensionChosen].timesChosen++; // increments the score for the chosen dimension
	};
};

/** Generates the assessment report across the dimensions provided.*/
generateReport() {
	let report = {};
	for (let dimension of Object.keys(this.counters)) {
		report[dimension] = this.counters[dimension].timesChosen;
	}
	return report;
};

};

export default Assessment;