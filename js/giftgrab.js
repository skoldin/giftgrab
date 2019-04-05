'use strict';

copyrightYear();

// modalSwitch();

function copyrightYear() {
  var copyright = document.getElementById("year");
  var today = new Date();
  var newYear = today.getFullYear();

  if (copyright) {
    copyright.textContent = newYear;
  }
}

(function app() {
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('order-form')) {
      return;
    }

    var currentStep = 1;

    var prevButton = document.getElementById('order-prev-step');
    var nextButton = document.getElementById('order-next-step');

    function handleStep(step) {
      var orderHeader = document.getElementById('orderHeaderText');
      var orderReview = document.getElementById('order-review');
      if (step <= 1) {
        currentStep = 1;
      } else if (step >= 3) {
        currentStep = 3;
      }
      if (currentStep === 3) {
        orderHeader.innerHTML = 'Review Order';
        orderReview.innerHTML = '';

        var formItems = Array.from(document.getElementById('order-form').elements);

        var inputTypes = ['input', 'select', 'textarea'];

        var reducer = function reducer(list, item) {
          if (item.type === 'file' || !inputTypes.includes(item.tagName.toLowerCase())) {
            return list;
          }

          var text = item.dataset.description ? item.dataset.description + ': ' : '';

          if (item.tagName.toLowerCase() === 'input' || item.tagName.toLowerCase() === 'textarea') {
            text += item.value;
          } else if (item.tagName.toLowerCase() === 'select') {
            // eslint-disable-next-line prefer-destructuring
            text += item.options[item.selectedIndex].text;
          }

          if (!text) {
            return list;
          }

          return list + '<li>' + text + '</li>';
        };

        var listItems = formItems.reduce(reducer, '');

        orderReview.innerHTML = listItems.trim();
      } else {
        orderHeader.innerHTML = 'Order with GiftGrab';
      }

      var orderForm = document.getElementById('order-form');

      orderForm.className = '';
      orderForm.classList.add('at-step-' + currentStep);
    }

    nextButton.onclick = function (e) {
      e.preventDefault();
      currentStep += 1;

      handleStep(currentStep);
    };
    prevButton.onclick = function (e) {
      e.preventDefault();
      currentStep -= 1;

      handleStep(currentStep);
    };
  });
})();

// function modalSwitch(){
// 	var next = document.getElementById("step2");
// 	var firstModal = document.getElementById("orderModal");
// 	var secondModal = document.getElementById("ordermodal2");

// 	next.addEventListener("click", function(){
// 		secondModal.modal();
// 	})
// }

// function modalChange(){
// 	var next = document.getElementById("nextBtn1");
// 	var firstModal = document.getElementById("giftgrabSignUp");
// 	var secondModal = document.getElementById("giftgrabAddress");

// 	next.addEventListener("click", function(){
// 		firstModal.classList.add("hideMe");
// 		secondModal.classList.remove("hideMe");
// 	})
// }
