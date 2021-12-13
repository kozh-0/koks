'use strict';

document.querySelector('.na_top').addEventListener('click', () => {
	document.documentElement.scrollTop = 0;
});

	/* TAB ==============================================================*/

const tabParent = document.querySelector('.list__in'),
	  tabs = tabParent.querySelectorAll('a'),
	  tabsContent = document.querySelectorAll('.variki__item');

function hideTabContent() {
	tabsContent.forEach(item => {
		item.classList.add('hide');
		item.classList.remove('show', 'fade');
	});
	tabs.forEach(item => {
		item.classList.remove('active')
	});
};

function showTabContent(i = 0) {
	tabsContent[i].classList.add('show', 'fade');
	tabsContent[i].classList.remove('hide');
	tabs[i].classList.add('active')
}

hideTabContent()
showTabContent()


tabParent.addEventListener('click', (e) => {
	if (e.target && e.target.tagName == 'A') {
		e.preventDefault();

		tabs.forEach((item, i) => {
			if (e.target == item) {
				hideTabContent()
				showTabContent(i)
			}
		});
	}
});


	/* TIMER ===========================================================*/

const deadline = '2021-12-31';
	// Объект со временем
function getTimeRemaining(endtime) { 
	const t = Date.parse(endtime) - Date.parse(new Date()),
		  days = Math.floor(t / (1000 * 60 * 60 * 24)), // t в дни
		  hours = Math.floor((t / (1000 * 60 * 60) % 24)),
		  minutes = Math.floor((t / (1000 * 60) % 60)),
		  seconds = Math.floor((t / 1000) % 60);

	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

	//Вывод на сайт
	
function setClock(selector, endtime) {
	const timer = document.querySelector(selector),
		  days = timer.querySelector('#days'),
		  hours = timer.querySelector('#hours'),
		  minutes = timer.querySelector('#minutes'),
		  seconds = timer.querySelector('#seconds'),
		  timeInterval = setInterval(updateClock, 1000);

	updateClock();// чтоб сразу норм время на сайте было, а не с верстки

	function updateClock() {
		const t = getTimeRemaining(endtime); //t = объект, где return

		days.innerHTML = t.days; //textContent тоже самое
		hours.innerHTML = t.hours;
		minutes.innerHTML = t.minutes;
		seconds.innerHTML = t.seconds;

		if (t.total <= 0) {
			clearInterval(timeInterval);
		}
	}
}

setClock('.timer', deadline);



	/* MODAL =========================================================*/


const modal = document.querySelector('.modal'),
	  modalTrigger = document.querySelector('.btn');

function openModal() {
	modal.classList.add('show');
	modal.classList.remove('hide');
	document.body.style.overflow = 'hidden';
	clearInterval(modalTimer);
};
function closeModal() {
	modal.classList.add('hide');
	modal.classList.remove('show');
	document.body.style.overflow = '';
};

modalTrigger.addEventListener('click', openModal);

document.addEventListener('click', (e) => {
	if (e.target === modal || e.target.getAttribute('data-close') == '') {
		closeModal();
	}
});
document.addEventListener('keydown', (e) => {
	if (e.code === 'Escape' && modal.classList.contains('show')) {
		closeModal();
	}
});

const modalTimer = setTimeout(openModal, 50000);

function showModalByScroll() {
	if  (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
		setTimeout(openModal, 1500);
		window.removeEventListener('scroll', showModalByScroll);
	}
};

// window.addEventListener('scroll', showModalByScroll);


	/* BURGER ==============================================================*/

const burger = document.querySelector('.hamburger'),
	  mobileMenu = document.querySelector('.menu');


function burgerToggle(flow = '', margin = '') {
	document.body.style.overflow = flow;
	document.querySelector('.tel').classList.toggle('hide');
	burger.style.marginLeft = margin;
}

burger.addEventListener('click', () => {
	mobileMenu.classList.toggle('showflex');
	if (mobileMenu.classList.contains('showflex')) {
		burgerToggle('hidden', 'auto');
	} else {
		burgerToggle();
	}
});

document.body.addEventListener('click', (e) => {
	if (mobileMenu.classList.contains('showflex') && !(e.target === mobileMenu)) {
		// mobileMenu.remove()
	}
});


	/* PRODUCTS GENERATOR =====================================================*/


class Product {
	constructor(src, alt, price, descr, parentSelector, ...classes) {
		this.src = src;
		this.alt = alt;
		this.price = price;
		this.descr = descr;
		this.classes = classes;
		this.parent = document.querySelector(parentSelector);
	}

	render() {
		const element = document.createElement('div');

		if (this.classes.length === 0) {
			element.classList.add('product__item');
		} else {
			element.classList.add('product__item');
			this.classes.forEach(className => element.classList.add(className));
		}

		element.innerHTML = `
			<img src=${this.src} alt=${this.alt}>
			<h4><span>${this.price}</span>$</h4>
			<p>${this.descr}</p>
		`;
		this.parent.append(element);
	}

}

const getData = async (url) => {
	const res = await fetch(url);
	if(!res.ok) {
		throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
	}
	return await res.json();
};

getData('nax.json')
	.then(data => {
		data.menu.forEach(({img, altimg, price, descr}) => {
			new Product(img, altimg, price, descr, '.product__list').render();
		});
	})




	// SLIDER ============================================================



const slides = document.querySelectorAll('.offer__slide'),
	  left = document.querySelector('.offer__slide-prev'),
	  right = document.querySelector('.offer__slide-next'),
	  index = document.querySelector('span#current'),
	  indexTotal = document.querySelector('span#total'),
	  slidesWrapper = document.querySelector('.slide__wrapper'),
	  slidesField = document.querySelector('.slide__field'),
	  width = window.getComputedStyle(slidesWrapper).width;
let offset = 0;
let slideIndex = 1;
	console.log(width);


if (slides.length < 10) {
	indexTotal.textContent = `0${slides.length}`;
	index.textContent = `0${slideIndex}`;
} else {
	indexTotal.textContent = slides.length;
	index.textContent = slideIndex;
}

slidesField.style.width = 100 * slides.length + '%';

slides.forEach(item => item.style.width = width);


slidesWrapper.style.position = 'relative';
const indicators = document.createElement('ol'),
	  dots = [];
indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 100px;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
`;
slidesWrapper.prepend(indicators);

for (let i = 0; i < slides.length; i++) {
	const dot = document.createElement('li');
	dot.setAttribute('data-slide-to', i + 1);
	dot.style.cssText = `
		box-sizing: content-box;
	    flex: 0 1 auto;
	    width: 30px;
	    height: 6px;
	    margin-right: 3px;
	    margin-left: 3px;
	    cursor: pointer;
	    background-color: #fff;
	    background-clip: padding-box;
	    border-top: 10px solid transparent;
	    border-bottom: 10px solid transparent;
	    opacity: .5;
	    transition: opacity .6s ease;
	`;
	if (i == 0) {dot.style.opacity = 1;}
	indicators.append(dot);
	dots.push(dot);
}

if((+window.getComputedStyle(document.querySelector('body')).width.slice(0, -2)) < 992) {
	indicators.style.bottom = '60px';
}


right.addEventListener('click', () => {
	offset == toDigit(width) * (slides.length - 1) ? offset = 0 : offset += toDigit(width);
	slidesField.style.transform = `translateX(-${offset}px)`;
	slideIndex == slides.length ? slideIndex = 1 : slideIndex++;
	dotsAndIndex();
});

left.addEventListener('click', () => {
	offset == 0 ? offset = toDigit(width) * (slides.length - 1) : offset -= toDigit(width);
	slidesField.style.transform = `translateX(-${offset}px)`;
	slideIndex == 1 ? slideIndex = slides.length : slideIndex--;
	dotsAndIndex();
});

dots.forEach(dot => {
	dot.addEventListener('click', (e) => {
		const slideTo = +e.target.getAttribute('data-slide-to');

		slideIndex = slideTo;
		offset = toDigit(width) * (slideTo - 1);
		slidesField.style.transform = `translateX(-${offset}px)`;

		dotsAndIndex();
	});
});

function dotsAndIndex() {
	if (slides.length < 10) {
		index.textContent = `0${slideIndex}`;
	} else {
		index.textContent = slideIndex;
	}
	dots.forEach(dot => dot.style.opacity = '.5');
	dots[slideIndex - 1].style.opacity = 1;
}
function toDigit(str) {
	return +str.replace(/\D/g, '')
}

	/* SERVER FROMS =====================================================*/



const forms = document.querySelectorAll('form');

forms.forEach(item => bindPostData(item)); // Запуск ф-ии

const message = {
	loading: 'img/icons/spinner.svg',
	success: "We'll contact you soon",
	failure: 'Something went wrong...'
}


// POST npm json-server

const postData = async (url, data) => {
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
		},
		body: data
	});

	return await res.json();
};

function bindPostData(form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const statusMessage = document.createElement('img');
		statusMessage.src = message.loading;
		statusMessage.style.cssText = `
			display: block;
			margin: 20px auto 0;
		`;
		form.append(statusMessage);

		const formData = new FormData(form);
		const json = JSON.stringify(Object.fromEntries(formData.entries()));

		postData('http://localhost:3000/requests', json)
		.then(data => {
			console.log(data);
			statusMessage.remove();
			showThanksModal(message.success);
		})
		.catch(() => {
			statusMessage.remove();			
			showThanksModal(message.failure);
		})
		.finally(() => form.reset());
	});
}




function showThanksModal(message) {
	const prevModal = document.querySelector('.modal__dialog');
	prevModal.classList.add('hide');
	openModal();

	const thanksModal = document.createElement('div');
	thanksModal.classList.add('modal__dialog');

	thanksModal.innerHTML = `
		<div class='modal__content'>
			<div data-close class="modal__close">&times;</div>
			<div class='modal__title'>${message}</div>
		</div>
	`;
	document.querySelector('.modal').append(thanksModal);

	setTimeout(() => {
		thanksModal.remove();
		prevModal.classList.add('show');
		prevModal.classList.remove('hide');
		closeModal();
	}, 4000);
}


