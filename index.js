// https://www.amazon.com/gp/aw/c/ref=QB9PUN0VJ3
// https://www.amazon.com/gp/cart/ajax-update.html
const axios = require('axios')
const yargs = require('yargs')
const cheerio = require('cheerio')
const getToken = async (asin) => {
    const response = await axios.get('https://www.amazon.com/gp/aw/c/ref=' + asin)
    const data = response.data
    const $ = cheerio.load(data)
    const $savedCartViewForm = $('#savedCartViewForm')
    const requestID = $savedCartViewForm.find('[name="requestID"]').val()
    const timeStamp = $savedCartViewForm.find('[name="timeStamp"]').val()
    const token = $savedCartViewForm.find('[name="token"]').val()
    const antiCsrftokenA2z = $savedCartViewForm.find('[name="anti-csrftoken-a2z"]').val()
    const dataAsin = $('[data-asin="' + asin + '"]')
    const actionItemID = dataAsin.data('itemid')
    const encodedOffering = dataAsin.data('encoded-offering')
    return {
        requestID,
        timeStamp,
        token,
        antiCsrftokenA2z,
        actionItemID,
        encodedOffering
    }
}
const getCartQty = async ({
    asin,
    requestID,
    timeStamp,
    token,
    actionItemID,
    encodedOffering
}) => {
    const response = await axios.post('https://www.amazon.com/gp/cart/ajax-update.html', {
        hasMoreItems: 0,
        timeStamp,
        token,
        requestID,
        closeAddonUpsell: 1,
        flcExpanded: 0,
        pageAction: 'update - quantity',
        displayedSavedItemNum: 0,
        actionItemID,
        actionType: 'update - quantity',
        asin,
        encodedOffering,
    })
    return response?.data?.features?.['nav-cart']?.cartQty
}
(async () => {
    const argv = yargs.alias('a', 'asin').argv
    const asin = argv.asin
    const { requestID, timeStamp, token, actionItemID, encodedOffering } = await getToken(asin)
    const cartQty = await getCartQty({ asin, requestID, timeStamp, token, actionItemID, encodedOffering })
    console.log(cartQty)
})()
