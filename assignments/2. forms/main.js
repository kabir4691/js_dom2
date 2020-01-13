function validateForm() {
	let form = document.forms[0];

	let nameInput = form["nameInput"];
	let nameError = document.getElementById("nameError");
	let nameValue = nameInput.value.trim();
	if (nameValue == "") {
        nameError.style.display = "initial";
		return false;
	} else {
		nameError.style.display = "none";
	}

	let emailInput = form["emailInput"];
	let emailError = document.getElementById("emailError");
	let emailValue = emailInput.value.trim();
	if (emailValue == "") {
        emailError.style.display = "initial";
		return false;
	} else {
		emailError.style.display = "none";
	}

	let passwordInput = form["passwordInput"];
	let passwordError = document.getElementById("passwordError");
	let passwordValue = passwordInput.value.trim();
	if (passwordValue == "") {
		passwordError.style.display = "initial";
		return false;
	} else {
		passwordError.style.display = "none";
	}

    // form.parentNode.removeChild(form);
    let formContainer = document.getElementById("formContainer");formContainer.parentNode.removeChild(formContainer);
    let successText = document.createElement("p");
    successText.innerHTML = `You are ${nameValue}<br>Your email: ${emailValue}<br>Your password: ${passwordValue}`;
    successText.style.fontSize = "24px";
	document.body.append(successText);
	return true;
}
