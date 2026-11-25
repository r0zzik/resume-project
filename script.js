const links = document.querySelectorAll('.header__link');
const pages = document.querySelectorAll('.page');
const burger = document.getElementById('burger');

const cityInput = document.getElementById('cityInput');
const selectList = document.querySelector('.select__list');
const selectItems = document.querySelectorAll('.select__item');

const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const summaryAbout = document.getElementById('summaryAbout');

const nameInput = document.getElementById('username');
const univerInput = document.getElementById('university');

const contactsContainer = document.querySelector('.contacts');
const addContactBtn = document.getElementById('addContact');
const saveContacts = document.getElementById('saveContacts');
const clearContacts = document.getElementById('clearContacts');
const summaryContacts = document.getElementById('summaryContacts');

const skillBtns = document.querySelectorAll('.skill');
const counter = document.getElementById('counter');
const saveSkills = document.getElementById('saveSkills');
const clearSkills = document.getElementById('clearSkills');
const summarySkills = document.getElementById('summarySkills');

const experienceText = document.getElementById('experienceText');
const saveExperience = document.getElementById('saveExperience');
const clearExperience = document.getElementById('clearExperience');
const summaryExperience = document.getElementById('summaryExperience');

const uploadBtn = document.getElementById('uploadBtn');
const clearPhotoBtn = document.getElementById('clearPhotoBtn');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const photoPlaceholder = document.getElementById('photoPlaceholder');

const pdfBtn = document.getElementById('pdfBtn');
const clearSummaryBtn = document.getElementById('clearSummaryBtn');

const linksArray = Array.from(links);

const year = document.getElementById('year');

// МЕНЮ HEADER

links.forEach((link) => {
    
    link.addEventListener('click', function (e) {
        e.preventDefault();
        // Убираем active у всех ссылок
        links.forEach((l) => l.classList.remove('header__link--active'));
        this.classList.add('header__link--active');

        // Прячем все страницы
        pages.forEach((p) => p.classList.remove('page--active'));

        // Показываем нужную
        const targetId = this.getAttribute('href').slice(1); // Убираем решеточку
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('page--active');
        }
        burger.checked = false;   // ← закрыть бургер-меню
    });
});

// АНИМАЦИЯ ОЧИСТКИ СЕКЦИИ

function restartAnimation(element) {
    element.classList.remove('animate');
    void element.offsetWidth;
    element.classList.add('animate');
}

// СЕКЦИЯ О СЕБЕ

// Отслеживаем выбор города
let selectedCity = '';

cityInput.addEventListener('input', () => {
    const value = cityInput.value.toLowerCase().trim();

    let visibleCount = 0;

    selectItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(value)) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    if (visibleCount === 0) {
        selectList.style.display = 'none';
        selectList.classList.remove('select__list--open');
    } else {
        selectList.style.display = 'block';
        selectList.classList.add('select__list--open');
    }
});

selectItems.forEach((item) => {
    item.addEventListener('click', () => {
        if (item.textContent === 'Свой вариант') {
            cityInput.value = '';
        } else {
            cityInput.value = item.textContent;
            selectedCity = item.textContent;
        }
        selectList.style.display = 'none';
        selectList.classList.remove('select__list--open');
    });
});

// Закрываем список если кликнули мимо
document.addEventListener('click', (e) => {
    if (
        !e.target.closest('.select__input') &&
        !e.target.closest('.select__list')
    ) {
        selectList.classList.remove('select__list--open');
        selectList.style.display = 'none';
    }
});


// ЛОКАЛ СТОРАЖ Сохр
function saveToStorage(key, value) {
    const data = JSON.parse(localStorage.getItem('resumeData')) || {};
    data[key] = value;
    localStorage.setItem('resumeData', JSON.stringify(data));
}
// ЛОКАЛ СТОРАЖ Удалить
function removeFromStorage(key) {
    const data = JSON.parse(localStorage.getItem('resumeData')) || {};
    delete data[key];
    localStorage.setItem('resumeData', JSON.stringify(data));
}

saveBtn.addEventListener('click', function () {
    selectedCity = cityInput.value;

    summaryAbout.innerHTML = `
        <h3><strong>${nameInput.value || '-'}</strong></h3>
        <p><strong>Город:</strong> ${selectedCity || '-'}</p>
        <p><strong>Университет:</strong> ${univerInput.value || '-'}</p>
    `;

    // Локал стораж
    const currentData = JSON.parse(localStorage.getItem('resumeData')) || {};

    currentData.about = {
        name: nameInput.value,
        city: selectedCity,
        univer: univerInput.value
    };

    localStorage.setItem('resumeData', JSON.stringify(currentData));
});

clearBtn.addEventListener('click', function () {
    const fields = document.querySelectorAll('#about .form__label, #about .form__input');
    fields.forEach((el) => restartAnimation(el));
    nameInput.value = '';
    univerInput.value = '';
    selectedCity = '';
    cityInput.value = '';
    summaryAbout.innerHTML = '';

    // Локал стораж
    const currentData = JSON.parse(localStorage.getItem('resumeData')) || {};
    delete currentData.about;
    localStorage.setItem('resumeData', JSON.stringify(currentData));
});

// СЕКЦИЯ КОНТАКТЫ

// Закрытие списка при клике мимо
document.addEventListener('click', (e) => {
    if (!e.target.closest('.contact__type-wrapper')) {
        document.querySelectorAll('.contact__list').forEach(list => {
           list.style.display = 'none';
           list.classList.remove('contact__list--open');
        });       
    }
});

// Добавить строку контакта
function createContactRow() {
    const contact = document.createElement('div');
    contact.className = 'contact';

    contact.innerHTML = `
        <div class='contact__type-wrapper'>
            <input class='form__input contact__type' type='text' placeholder='Введите тип контакта' autocomplete='off'>
            <ul class='contact__list'>
                <li class='contact__item'>Свой вариант</li>
                <li class='contact__item'>Телефон</li>
                <li class='contact__item'>Эл. почта</li>
                <li class='contact__item'>Адрес</li>
            </ul>
        </div>
        <input class='form__input contact__value' type='text' placeholder='...'>
        <button class='contact__remove' type='button'>✕</button>
    `;

    // Автокомплит для типа
    const typeInput = contact.querySelector('.contact__type');
    const list = contact.querySelector('.contact__list');
    const items = contact.querySelectorAll('.contact__item');

    typeInput.addEventListener('input', () => {
        const value = typeInput.value.toLowerCase().trim();
        let visibleCount = 0;

        items.forEach((item) => {
            if (item.textContent.toLowerCase().includes(value)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            list.style.display = 'none';
            list.classList.remove('contact__list--open');
        } else {
            list.style.display = 'block';
            list.classList.add('contact__list--open');
        }
    });

    // Выбор из списка
    items.forEach((item) => {
        item.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Чтобы инпут не потерялся
            if (item.textContent === 'Свой вариант') {
                typeInput.value = '';
            } else {
                typeInput.value = item.textContent;
            }
            list.style.display = 'none';
            list.classList.remove('contact__list--open');
        });
    });

    // Удаление строки
    contact.querySelector('.contact__remove').addEventListener('click', () => {
        contact.remove();
    });

    return contact;
}

// Добавляем две строки по умолчанию
contactsContainer.appendChild(createContactRow());
contactsContainer.appendChild(createContactRow());

// Кнопка 'Добавить контакт'
addContactBtn.addEventListener('click', () => {
    contactsContainer.appendChild(createContactRow());
});

// Сохранить контакты
saveContacts.addEventListener('click', () => {
    const rows = contactsContainer.querySelectorAll('.contact');
    // Массив для локалстораж
    const contactsArray = [];

    let contactsHtml = '';
    rows.forEach((row) => {
        const type = row.querySelector('.contact__type').value.trim();
        const value = row.querySelector('.contact__value').value.trim();

        if (type && value) {
            contactsHtml += `<li>${type}: ${value}</li>`;
            contactsArray.push({ type, value });
        }
    });

    if (contactsHtml) {
        summaryContacts.innerHTML = `
            <p><strong>Контакты:</strong></p>
            <ul>${contactsHtml}</ul>
        `;
        saveToStorage('contacts', contactsArray);
    } else {
        summaryContacts.innerHTML = '';
        removeFromStorage('contacts');
    }
});

// Очистить контакты
clearContacts.addEventListener('click', () => {
    contactsContainer.innerHTML = '';
    summaryContacts.innerHTML = '';
    contactsContainer.appendChild(createContactRow());
    contactsContainer.appendChild(createContactRow());

    removeFromStorage('contacts');
});

// СЕКЦИЯ НАВЫКИ

const skillLevels = {};

skillBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const skill = btn.dataset.skill;

        // Если не выбран и уже есть 5 - не добавляем
        if (!skillLevels[skill] && Object.keys(skillLevels).length >= 5) {
            alert('Не больше 5 навыков!');
            return;
        }

        // Если не выбран, начинаем с 1
        if (!skillLevels[skill]) {
            skillLevels[skill] = 1;
        } else {
            skillLevels[skill]++;
        }

        // Если уровень больше 3, снимаем навык
        if (skillLevels[skill] > 3) {
            delete skillLevels[skill];
            btn.className = 'skill';
            btn.textContent = skill;
            updateCounter();
            return;
        }

        // Обновляем кнопку
        const level = skillLevels[skill];
        btn.className = `skill skill--level-${level}`;

        const levelNames = { 1: 'Начальный', 2: 'Средний', 3: 'Продвинутый' };
        btn.innerHTML = `${skill} <span class='skill__level'>${levelNames[level]}</span>`;

        updateCounter();
    });
});

function updateCounter() {
    counter.textContent = Object.keys(skillLevels).length;
}

saveSkills.addEventListener('click', () => {
    const levelNames = { 1: 'Начальный', 2: 'Средний', 3: 'Продвинутый' };

    summarySkills.innerHTML = `
        <p><strong>Навыки:</strong></p>
        <ul>
            ${Object.entries(skillLevels)
                .map(
                    ([skill, level]) =>
                        `<li>${skill} - Уровень: ${levelNames[level]}</li>`,
                ).join('')}
        </ul>
    `;

    saveToStorage('skills', skillLevels);
});

clearSkills.addEventListener('click', () => {
    const skillsContainer = document.querySelector('#skills .skills');
    const skillsCounter = document.querySelector('#skills .skills__counter');
    skillsContainer.style.display = 'none';
    skillsCounter.style.display = 'none';
    void skillsContainer.offsetWidth; // пересчёт
    void skillsCounter.offsetWidth; // пересчёт
    skillsContainer.style.display = '';
    skillsCounter.style.display = '';

    for (let key in skillLevels) {
        delete skillLevels[key];
    }
    skillBtns.forEach((btn) => {
        btn.className = 'skill';
        btn.textContent = btn.dataset.skill;
    });
    counter.textContent = '0';
    summarySkills.innerHTML = '';

    removeFromStorage('skills');
});

// СЕКЦИЯ ОПЫТ

saveExperience.addEventListener('click', function () {
    summaryExperience.innerHTML = `
        <p><strong>Опыт работы:</strong></p>
        <p>${experienceText.value.replace(/\n/g, '<br>') || '-'}</p>
    `;
    saveToStorage('experience', experienceText.value);
});

clearExperience.addEventListener('click', function () {
    const fields = document.querySelectorAll('#experience .form__label, #experience .form__textarea');
    fields.forEach((el) => restartAnimation(el));
    experienceText.value = '';
    summaryExperience.innerHTML = '';

    removeFromStorage('experience');
});

// СЕКЦИЯ РЕЗЮМЕ

// КНОПКИ В РЕЗЮМЕ

pdfBtn.addEventListener('click', function () {
    window.print();
});

clearSummaryBtn.addEventListener('click', function () {
    const clearSummary = document.querySelector('#summary .summary');
    clearSummary.style.display = 'none';
    void clearSummary.offsetWidth; // пересчёт
    clearSummary.style.display = '';

    // Очистить фото
    photoPreview.src = '#';
    photoPreview.hidden = true;
    photoPlaceholder.style.display = 'flex';
    photoInput.value = '';

    // Очистить тексты
    summaryAbout.innerHTML = '';
    summaryContacts.innerHTML = '';
    summarySkills.innerHTML = '';
    summaryExperience.innerHTML = '';

    // Локал стораж - полностью очистить
    localStorage.removeItem('resumeData');

    // Очистить все поля ввода
    clearBtn.click();
    clearContacts.click();
    clearSkills.click();
    clearExperience.click();
});

// КНОПКИ В РЕЗЮМЕ ФОТО

uploadBtn.addEventListener('click', () => {
    photoInput.click();
});

photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.src = e.target.result;
            photoPreview.hidden = false;
            photoPlaceholder.style.display = 'none';
            // Чтобы сайт не завис призагрузке слишком тяжелого фото
            try {
                saveToStorage('photo', e.target.result);
            } catch (err) {
                alert('Фото слишком большое для сохранения в памяти браузера, но в PDF оно выгрузится!');
            }
        };
        reader.readAsDataURL(file);
    }
});

clearPhotoBtn.addEventListener('click', () => {
    photoPreview.src = '#';
    photoPreview.hidden = true;
    photoPlaceholder.style.display = 'flex';
    photoInput.value = '';

    removeFromStorage('photo');
});

// КНОПКИ НАЗАД И ДАЛЕЕ

document.querySelectorAll('.form__button--next').forEach((btn) => {
    btn.addEventListener('click', () => {
        const activeIndex = linksArray.findIndex((link) => 
            link.classList.contains('header__link--active')
        );
        if (linksArray[activeIndex + 1]) {
            linksArray[activeIndex + 1].click();
        }
    });
});

document.querySelectorAll('.form__button--prev').forEach((btn) => {
    btn.addEventListener('click', () => {
        const activeIndex = linksArray.findIndex((link) => 
            link.classList.contains('header__link--active')
        );
        if (linksArray[activeIndex - 1]) {
            linksArray[activeIndex - 1].click();
        }
    });
});

// ФУТЕР

year.textContent = new Date().getFullYear();

// ЛОКАЛ СТОРАЖ

const saved = JSON.parse(localStorage.getItem('resumeData'));

if (saved) {
    // О себе
    if (saved.about) {
        nameInput.value = saved.about.name || '';
        cityInput.value = saved.about.city || '';
        univerInput.value = saved.about.univer || '';
        // Автоматически вписывать в итоговое резюме
        saveBtn.click();
    }

    // Контакты
    if (saved.contacts && saved.contacts.length > 0) {
        // Убираем 2 пустые строчки по умолчанию
        contactsContainer.innerHTML = '';
        saved.contacts.forEach((item) => {
            const row = createContactRow();
            row.querySelector('.contact__type').value = item.type;
            row.querySelector('.contact__value').value = item.value;
            contactsContainer.appendChild(row);
        });
        saveContacts.click();
    }

    // Навыки
    if (saved.skills) {
        const levelNames = { 1: 'Начальный', 2: 'Средний', 3: 'Продвинутый'};
        Object.assign(skillLevels, saved.skills);

        skillBtns.forEach((btn) => {
            const skill = btn.dataset.skill;
            const level = skillLevels[skill];
            if (level) {
                btn.className = `skill skill--level-${level}`;
                btn.innerHTML = `${skill} <span class='skill__level'>${levelNames[level]}</span>`;
            }
        });
        updateCounter();
        saveSkills.click();
    }

    // Опыт
    if (saved.experience) {
        experienceText.value = saved.experience;
        saveExperience.click();
    }

    // Фото
    if (saved.photo) {
        photoPreview.src = saved.photo;
        photoPreview.hidden = false;
        photoPlaceholder.style.display = 'none';
    }
}  
