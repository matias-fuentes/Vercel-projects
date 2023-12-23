/* The API endpoint URL where we collect the stock info. */
const endpoint = 'https://api.twelvedata.com/quote?apikey=fb01cc4fc950475c8413b6c26ab8d953&symbol=';
const fillerContainer = document.querySelector('#filler-container');

fillerContainer.addEventListener('submit', async function (event) {
    /* We prevent the form its default behavior of sending a POST method, so we can handle all
    with JavaScript at the client side. */
    event.preventDefault();

    /* We extract the value of the stock entered. */
    const stockSearch = document.querySelector('#stock-search').value;

    /* Fetch the information */
    let quoteData = await fetch(endpoint + stockSearch);
    quoteData = await quoteData.json();

    /* Check if there's an error. If there's we show it. */
    if (quoteData.status === 'error') {
        const warningMessageContainer = document.querySelector('#warning-message-container');
        const warningMessage = document.querySelector('#warning-message');
        warningMessage.textContent = quoteData.message;
        warningMessageContainer.appendChild(warningMessage);
    } else {
        const fields = Array.from(document.querySelectorAll('.stock-info-container > * > span'));

        /* And finally, if everything's correct, we iterate through the fields, and fill them with custom attributes. */
        let offset = 1;
        fields.forEach((field, index) => {
            /* key = actual key name in the iteration of quoteData. */
            let key = Object.keys(quoteData)[index + offset];
            /* We don't want to show the info of the stock of a year later, so, we only proceed to show the other
            information */
            if (key !== 'fifty_two_week') {
                if (key === 'name') {
                    const symbol = fields[0];
                    symbol.setAttribute('quoteData', quoteData['symbol']);
                    symbol.textContent = symbol.getAttribute('quoteData');

                    const name = document.querySelector('#name');
                    name.setAttribute(key, quoteData[key]);
                    name.textContent = name.getAttribute(key) + ' |';
                } else if (key === 'close') {
                    const currency = document.querySelector('#currency').getAttribute('currency');

                    const price = document.querySelector('#price');
                    const priceValue = parseFloat(quoteData[key]).toFixed(2);
                    price.setAttribute(key, priceValue);
                    price.textContent = price.getAttribute('close') + ' ' + currency;

                    offset++;
                    key = Object.keys(quoteData)[index + offset];
                    field.setAttribute(key, quoteData[key]);
                    const close = parseInt(field.getAttribute(key)).toLocaleString();
                    field.textContent = close + ' ' + currency;
                } else {
                    /* With parseFloat we convert the key value into a primitive data type of type float.
                    If the key value cannot be converted to a float, the function returns NaN (Not a Number).
                    With this we can differentiate in the loop if we're dealing with a number or with a text.
                    
                    And we need to differentiate in order to convert the float values in float values with
                    maximum two points decimals (with toFixed(2)). */
                    const floatValue = parseFloat(quoteData[key]).toFixed(2);
                    if (isNaN(floatValue) || key === 'datetime') {
                        field.setAttribute(key, quoteData[key]);
                        field.textContent = field.getAttribute(key);
                    } else {
                        if (floatValue % 1 !== 0) {
                            field.setAttribute(key, floatValue);
                            field.textContent = field.getAttribute(key);
                        } else {
                            const currency = document.querySelector('#currency').getAttribute('currency');
                            field.setAttribute(key, quoteData[key]);
                            const averageVolume = parseInt(field.getAttribute(key)).toLocaleString();
                            field.textContent = averageVolume + ' ' + currency;
                        }
                    }
                }
            }
        });
    }
});
