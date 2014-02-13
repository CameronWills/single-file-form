var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Questionnaire;
(function (Questionnaire) {
    var Choice = (function () {
        function Choice(id, text) {
            this.ChoiceId = id;
            this.Text = ko.observable(text ? text : id);
        }
        return Choice;
    })();
    Questionnaire.Choice = Choice;

    var Question = (function () {
        function Question(id, text, choices, visible) {
            this.QuestionId = id;
            this.Text = ko.observable(text);
            this.Choices = ko.observableArray(choices);
            this.Multiple = false;
            this.Visible = ko.computed(visible ? visible : function () {
                return true;
            });
            this.createAnswer();
        }
        Question.prototype.createAnswer = function () {
            this.Answer = ko.observable();
        };

        Question.prototype.push = function (questions) {
            questions.push(this);
            return this;
        };
        return Question;
    })();
    Questionnaire.Question = Question;

    var QuestionMulti = (function (_super) {
        __extends(QuestionMulti, _super);
        function QuestionMulti(id, text, choices, visible) {
            _super.call(this, id, text, choices, visible);
            this.Multiple = true;
        }
        QuestionMulti.prototype.createAnswer = function () {
            this.Answer = ko.observableArray();
        };
        return QuestionMulti;
    })(Question);
    Questionnaire.QuestionMulti = QuestionMulti;

    var ViewModel = (function () {
        function ViewModel(data) {
            this.Name = ko.observable("");
            this.Questions = this.buildQuestions();
            if (data != null)
                this.load(data);
        }
        ViewModel.prototype.persist = function () {
            return ko.toJS(this);
        };

        ViewModel.prototype.load = function (data) {
            this.Name(data.Name);
            for (var i = 0; i < data.Questions.length; i++) {
                var question = data.Questions[i];
                this.Questions[i].Answer(question.Answer);
            }
        };

        ViewModel.prototype.buildQuestions = function () {
            var questions = new Array();

            var question1 = new Question(1, "What day of the week is it?", [
                new Choice("Monday"),
                new Choice("Tuesday"),
                new Choice("Wednesday"),
                new Choice("Thursday"),
                new Choice("Friday"),
                new Choice("Saturday"),
                new Choice("Sunday")
            ]).push(questions);

            var question2 = new QuestionMulti(2, "What will you do today?", [
                new Choice("Eat"),
                new Choice("Sleep"),
                new Choice("Code")
            ], function () {
                return question1.Visible() && question1.Answer() != null;
            }).push(questions);

            var question3 = new Question(3, "Is it cold today?", [
                new Choice("Yes"),
                new Choice("No")
            ], function () {
                return question2.Visible() && question2.Answer().length > 0;
            }).push(questions);

            var question4 = new Question(4, "What is your favourite flavour of ice cream?", [
                new Choice("Chocolate"),
                new Choice("Vanilla"),
                new Choice("Strawberry")
            ], function () {
                return question3.Visible() && question3.Answer() != null;
            }).push(questions);

            var question5 = new Question(5, "What is your favourite pizza topping?", [
                new Choice("Hawaiian"),
                new Choice("Supreme"),
                new Choice("Margarita"),
                new Choice("Other")
            ], function () {
                return question4.Visible() && question4.Answer() != null;
            }).push(questions);

            var question6 = new Question(6, "Do you need an alternative to fillable PDF forms?", [
                new Choice("Yes"),
                new Choice("No")
            ], function () {
                return question5.Visible() && question5.Answer() != null;
            }).push(questions);

            return questions;
        };

        ViewModel.prototype.visibleAnswer = function (question, answer) {
            return function () {
                return question.Visible() && question.Answer() == answer;
            };
        };
        return ViewModel;
    })();
    Questionnaire.ViewModel = ViewModel;
})(Questionnaire || (Questionnaire = {}));
