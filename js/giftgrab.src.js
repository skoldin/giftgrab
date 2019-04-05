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
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('order-form')) {
      return;
    }

    let currentStep = 1;

    const prevButton = document.getElementById('order-prev-step');
    const nextButton = document.getElementById('order-next-step');

    function handleStep(step) {
      const orderHeader = document.getElementById('orderHeaderText');
      const orderReview = document.getElementById('order-review');
      if (step <= 1) {
        currentStep = 1;
      } else if (step >= 3) {
        currentStep = 3;
      }
      if (currentStep === 3) {
        orderHeader.innerHTML = 'Review Order';
        orderReview.innerHTML = '';

        const formItems = Array.from(document.getElementById('order-form').elements);

        const inputTypes = ['input', 'select', 'textarea'];

        const reducer = (list, item) => {
          if (item.type === 'file' || !inputTypes.includes(item.tagName.toLowerCase())) {
            return list;
          }

          let text = (item.dataset.description) ? `${item.dataset.description}: ` : '';

          if (item.tagName.toLowerCase() === 'input' || item.tagName.toLowerCase() === 'textarea') {
            text += item.value;
          } else if (item.tagName.toLowerCase() === 'select') {
            // eslint-disable-next-line prefer-destructuring
            text += item.options[item.selectedIndex].text;
          }

          if (!text) {
            return list;
          }

          return `${list}<li>${text}</li>`;
        };

        const listItems = formItems.reduce(reducer, '');

        orderReview.innerHTML = listItems.trim();
      } else {
        orderHeader.innerHTML = 'Order with GiftGrab';
      }

      const orderForm = document.getElementById('order-form');

      orderForm.className = '';
      orderForm.classList.add(`at-step-${currentStep}`);
    }

    nextButton.onclick = (e) => {
      e.preventDefault();
      currentStep += 1;

      handleStep(currentStep);
    };
    prevButton.onclick = (e) => {
      e.preventDefault();
      currentStep -= 1;

      handleStep(currentStep);
    };
  });
}());

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