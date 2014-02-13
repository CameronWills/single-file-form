/// <reference path="libs/knockout.d.ts" />
module Questionnaire {

    export class Choice {

        ChoiceId: string;
        Text: KnockoutObservable<string>;

        constructor(id: string, text?: string) {
            this.ChoiceId = id;
            this.Text = ko.observable<string>(text ? text : id);
        }
    }

    export class Question<T> {

        QuestionId: number;
        Text: KnockoutObservable<string>;
        Choices: KnockoutObservableArray<Choice>;
        Answer: KnockoutObservable<T>;
        Multiple: boolean;
        Visible: KnockoutComputed<boolean>;

        constructor(id: number, text: string, choices: Array<Choice>, visible?: () => boolean) {
            this.QuestionId = id;
            this.Text = ko.observable<string>(text);
            this.Choices = ko.observableArray<Choice>(choices);
            this.Multiple = false;
            this.Visible = ko.computed<boolean>(visible ? visible : () => { return true; });
            this.createAnswer();
        }

        createAnswer() {
            this.Answer = ko.observable<T>();
        }

        public push(questions:Array<Question<any>>) : Question<T> {
            questions.push(this)
            return this;
        }
    }

    export class QuestionMulti<T> extends Question<T>     {

        // Override answer type to support multiple selections - i.e. checkboxes
        Answer: KnockoutObservableArray<T>;

        constructor(id: number, text: string, choices: Array<Choice>, visible?: () => boolean) {
            super(id, text, choices, visible)
            this.Multiple = true;
        }

        createAnswer() {
            this.Answer = ko.observableArray<T>();
        }
    }

    export interface IQuestion<T> {
        Answer: T;
    }

    export interface IViewModel {
        Name: string;
        Questions: Array<IQuestion<any>>;
    }

    export class ViewModel {

        Name: KnockoutObservable<string>;
        Questions: Array<Question<any>>;

        constructor(data?: IViewModel) {
            this.Name = ko.observable<string>("");
            this.Questions = this.buildQuestions();
            if (data != null)
                this.load(data);
        }

        public persist(): Object {
            return ko.toJS(this);
        }

        public load(data: IViewModel) {
            this.Name(data.Name);
            for (var i = 0; i < data.Questions.length; i++) {
                var question = data.Questions[i]
                this.Questions[i].Answer(question.Answer);
            }
        }

        private buildQuestions(): Array<Question<any>> {

            var questions = new Array<Question<any>>();

            var question1 = new Question<string>(1, "What day of the week is it?",
                [
                    new Choice("Monday"),
                    new Choice("Tuesday"),
                    new Choice("Wednesday"),
                    new Choice("Thursday"),
                    new Choice("Friday"),
                    new Choice("Saturday"),
                    new Choice("Sunday")
                ]).push(questions);

            var question2 = new QuestionMulti<string>(2, "What will you do today?",
                [
                    new Choice("Eat"),
                    new Choice("Sleep"),
                    new Choice("Code")
                ],
                () => { return question1.Visible() && question1.Answer() != null })
                .push(questions);

            var question3 = new Question<string>(3, "Is it cold today?",
                [
                    new Choice("Yes"),
                    new Choice("No")
                ],
                () => { return question2.Visible() && question2.Answer().length > 0 })
                .push(questions);

            var question4 = new Question<string>(4, "What is your favourite flavour of ice cream?",
                [
                    new Choice("Chocolate"),
                    new Choice("Vanilla"),
                    new Choice("Strawberry")
                ],
                () => { return question3.Visible() && question3.Answer() != null })
                .push(questions);

            var question5 = new Question<string>(5, "What is your favourite pizza topping?",
                [
                    new Choice("Hawaiian"),
                    new Choice("Supreme"),
                    new Choice("Margarita"),
                    new Choice("Other"),
                ],
                () => { return question4.Visible() && question4.Answer() != null })
                .push(questions);

            var question6 = new Question<string>(6, "Do you need an alternative to fillable PDF forms?",
                [
                    new Choice("Yes"),
                    new Choice("No")
                ],
                () => { return question5.Visible() && question5.Answer() != null })
                .push(questions);

            return questions;
        }

        private visibleAnswer<T>(question: Question<T>, answer: T): () => boolean {
            return () => { return question.Visible() && question.Answer() == answer };
        }

    }
}

