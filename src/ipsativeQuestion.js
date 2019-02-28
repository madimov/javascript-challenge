class IpsativeQuestion {

/** Represents an ipsative question, which was only 2 possible answers.*/
constructor(title = "Pick the answer that describes you best:", text = "", answerOptions = []) {
	this.title = title;
	this.answerOptions = answerOptions;
	this.text = text;
	this.answerChoice;
};

/** Updates the question text to contain the title and both answer options.*/
buildText() {
	this.text += this.title + "\n" + this.answerOptions[0].answer + "\n" + this.answerOptions[1].answer;
};

};

export default IpsativeQuestion;