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
        let converted = convertCurrency(price);
    
        // Special Chinese formatting: 4-digit grouping, dot decimal
        if (locale === 'zh-CN') {
    // keep two decimals
    const [rawInt, fracPart] = converted.toFixed(2).split('.');
    let intPart = rawInt;
    let sign = '';

    // handle negatives
    if (intPart.startsWith('-')) {
        sign = '-';
        intPart = intPart.slice(1);
    }

    // 4-digit grouping from the right
    let groups = [];
    while (intPart.length > 4) {
        groups.unshift(intPart.slice(-4));
        intPart = intPart.slice(0, -4);
    }
    groups.unshift(intPart);

    const groupedInt = groups.join(',');
    const formattedCN = `${sign}¥${groupedInt}.${fracPart}`;
    return `<h4>${formattedCN}</h4>`;
}
    
        // Default: rely on Intl for en-US, fr-FR, etc.
        const formatted = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyMap[locale],
            useGrouping: true
        }).format(converted);
    
        return `<h4>${formatted}</h4>`;
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