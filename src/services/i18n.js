import { locale, updateLocale } from '../app.js';

var stringsJSON = {};

const i18n = {

    //load resource json based on locale
    loadStringsJSON: async (newLocale) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(`./content/${newLocale}/strings.json`, options)
            stringsJSON = await response.json();
        } catch (err) {
            console.log('Error getting strings', err);
            if (newLocale != "en-US") {
                updateLocale("en-US");
            }
        }
    },

    //load resource json based on locale
    getString: (view, key) => {
        return stringsJSON[view][key];
    },

    //determine the proper currency format based on locale and return html string
    formatCurrency: (price, color) => {
        let formatted;
        let converted = convertCurrency(price);
        formatted = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyMap[locale] }).format(converted); //$NON-NLS-L$ 
        //return the formatted currency within template literal
        return `<h4>${formatted}</h4>`


    },
    //return the locale based link to html file within the 'static' folder
    getHTML: () => {
        return `${locale}/terms.html`; //$NON-NLS-L$ 
    },
    //format date accoring to locale
   // format date according to locale (numeric, locale decides order)
formatDate: (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat(locale, options).format(date);
}

}

//used to determine the correct currency symbol
var currencyMap = {
    'en-US': 'USD',
    'zh-CN': 'CNY',
    'fr-FR': 'EUR'
};

//function to perform rough conversion from galactic credits to real currencies
//Disabled for project
var convertCurrency = (price) => {
    return price;
}

export default i18n;