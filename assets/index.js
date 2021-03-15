const $ = (x, ctx) => (ctx || document).querySelector(x);
const $$ = (x, ctx) => [].slice.call( (ctx || document).querySelectorAll(x) );
const { serialize, validate } = formee;

const myForm = $("#form");
const output = $("#output");

const rules = {
	// name is optional & alphanumeric
	name(val) {
		if (!val) return true; // because optional
		return !/[\W_]+/g.test(val) || 'Must be alphanumeric characters';
	},
	// password must be >= 8 length
	password(val) {
		if (!val) return 'Required';
		return val.length >= 8 || 'Must be at at least 8 characters';
	},
	// confirm must match password
	confirm(val, data) {
		if (!val) return 'Required';
		return val === data.password || 'Does not match!';
	},
	// email is required & must be email
	// --> Example RegExp
	email: /.+\@.+\..+/,
	// referrers is a String
	referers(val) {
		return !!val;
	},
	// movies can be String or Array
	movies(val) {
		return val && val.length > 1 || 'Please select at least one movie';
	}
};


// Demo: print JSON object of the form data
myForm.onchange = ev => {
	output.innerHTML = JSON.stringify(serialize(myForm), null, 2);
};


// Hack: Update output while typing
$$('input', myForm).forEach(el => {
	el.oninput = myForm.onchange;
});


// Demo: Validate
const isValid = $('#validate').onclick = ev => {
	toClear(); // wipe existing errors
	if (myForm.isValid) return true;
	let k, tmp, errors = validate(myForm, rules);
	for (k in errors) {
		tmp = $(`[name=${k}]`, myForm);
		toError(tmp, errors[k]);
	}
};

// Demo: Submit handler
//~> Done autoamtically via `formee.bind`
$('#submit').onclick = myForm.onsubmit = ev => {
	ev.preventDefault();
	// reuse existing demo code
	return isValid() ? alert('submit!') : alert('errors!');
};


// Chore: Reset
$('#clear').onclick = ev => {
	myForm.reset();
	output.innerHTML = '// serialized data goes here';
	toClear();
};


// Helper: Clear existing errors
function toClear() {
	$$('.error-msg', myForm).forEach(x => {
		x.remove();
	});
}


// Helper: Create an Error label
//~> You will use your UI lib of choice for this
function toError(input, msg) {
	let label = $('label', input.closest('.input'));
	let span = document.createElement('span');
	span.innerText = msg || 'Required';
	span.className = 'error-msg';
	insertAfter(span, label);
}

function insertAfter(nxt, elem) {
	elem.parentNode.insertBefore(nxt, elem.nextSibling);
}