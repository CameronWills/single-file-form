/// <reference path="libs/jquery.d.ts" />
/// <reference path="libs/FileSaver.d.ts" />
/// <reference path="libs/knockout.d.ts" />
/// <reference path="model.ts" />

var vm = new Questionnaire.ViewModel();
ko.applyBindings(vm);

// Override the Ctrl+S (Save) keyboard combination
document.addEventListener("keydown", function (e) {
    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        SaveChanges();
    }
}, false);

function SaveChanges() {

    var data = JSON.stringify(vm.persist());
    $("#model-data").html("vm.load(" + data + ");");

    var elem = $("#questions").detach();

    var page = new Blob([document.documentElement.outerHTML],
        { type: "application/html;charset=" + document.characterSet });

    elem.appendTo("#questions-container");

    var fileSaver = saveAs(page, vm.Name() + ".html");
}