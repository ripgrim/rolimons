const req = require("./request.js")
const cheerio = require('cheerio')

const endpoint = "https://api.rolimons.com/items/v1/itemdetails"
const uaidurl = "https://www.rolimons.com/uaid/"

var Cached = {
    Status: false,
    Data: undefined
}; 

const dict = {
    demand: {
        "-1": "Unassigned",
        "4": "Amazing",
        "3": "High",
        "2": "Normal",
        "1": "Low",
        "0": "Terrible"
    },
    trend: {
        "-1": "Unassigned",
        "3": "Raising",
        "2": "Stable",
        "1": "Unstable",
        "0": "Lowering"
    },
    booleans: {
        "1": true,
        "-1": false
    }
}

async function getItems() {
    let items
    if (!Cached['Status']) {
        items = await req.request(endpoint)
        if (items && items.rateLimited) {
            console.log("[Rolimons] You are being rate limited by the API. Please wait and try again.");
            return { rateLimited: true };
        }
        if (!items || !items['data']) {
            return {};
        }
        Cached['Status'] = true
        Cached['Data'] = items
    }
    else {
        items = Cached['Data']
    }
    return items['data']
}

function clear_cache() {
    Cached['Status'] = false
    Cached['Data'] = undefined
}

function find(itemdata, filter) {
    const keys = Object.keys(itemdata[0].items);
    let found;
    const filterLower = filter.toLowerCase();
    for (let i = 0; i < keys.length; i++) {
        const valueInIteration = itemdata[0].items[keys[i]];
        if (typeof valueInIteration[1] === 'string' && valueInIteration[1].toLowerCase() === filterLower) {
            found = valueInIteration
            break;
        }
    }
    return found;
}

async function searchItem(mode, info) {
    let result;
    if (mode == 'name') {
        var newi = info
        if (newi.length <= 6) {
            newi = newi.toUpperCase() 
        } else {
            newi = info
        }
        try {
        await getItems().then( 
            async function(data) {
                if (data && data.rateLimited) {
                    console.log("[Rolimons] You are being rate limited by the API. Please wait and try again.");
                    result = { rateLimited: true };
                    return result;
                }
                if (!data) {
                    result = false;
                    return result;
                }
                let parsed = [data]
                let found = find(parsed, newi)
                if (!found) {
                    result = false;
                    return result;
                }
                // Basic (Names & Values)
                found.name = found[0]
                found.acronym = found[1]
                found.rap = found[2]
                found.value = found[3]
                found.default_value = found[4]
                // Filtered by dictionary above
                found.demand = dict.demand[found[5]]
                found.trend = dict.trend[found[6]]
                found.projected = dict.booleans[found[7]]
                found.hyped = dict.booleans[found[8]]
                found.rare = dict.booleans[found[9]]
                result = found
            }
        )
        return result
    } catch (e) {
        return false
    }
    }
    if (mode == 'id') {
        try {
        await getItems().then(
            async function(data) {
                if (data && data.rateLimited) {
                    console.log("[Rolimons] You are being rate limited by the API. Please wait and try again.");
                    result = { rateLimited: true };
                    return result;
                }
                if (!data) {
                    result = false;
                    return result;
                }
                const found = data['items'][info]
                if (!found) {
                    result = false;
                    return result;
                }
                found.name = found[0]
                found.acronym = found[1]
                found.rap = found[2]
                found.value = found[3]
                found.default_value = found[4]
                // Filtered by dictionary above
                found.demand = dict.demand[found[5]]
                found.trend = dict.trend[found[6]]
                found.projected = dict.booleans[found[7]]
                found.hyped = dict.booleans[found[8]]
                found.rare = dict.booleans[found[9]]
                result = found
            }
        )
        return result
    } catch (e) {
        return false
    }
    }
}

async function getUAID(UAID, users) {
    let data = []
    data['history'] = []
    const response = await req.request(uaidurl + UAID)
    if (response && response.rateLimited) {
        console.log("[Rolimons] You are being rate limited by the API. Please wait and try again.");
        return { rateLimited: true };
    }
    if (!response || !response['data']) {
        return data;
    }
    const parsed = cheerio.load(response['data'])
    let count = 1
    data['item_name'] = parsed('#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div:nth-child(1) > div.d-flex.mt-0.mt-md-4 > div.mx-2.mt-2.pt-0.pt-md-1.text-truncate > h5').text()
    data['last_owner'] = parsed('#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div:nth-child(1) > div:nth-child(2) > div.mx-2.mt-2.pt-1 > h5').text()
    data['serial'] = parsed('#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div.mt-0.mt-sm-1.stat_pane_stat_column.d-block.d-sm-none.d-md-block > div.d-flex.mt-0.mt-sm-4 > div.mx-2.mt-2.pt-0.pt-md-1 > h5').text()
    data['owned_since'] = parsed('#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div:nth-child(1) > div:nth-child(3) > div.mx-2.mt-2.pt-1 > h5').text()
    data['created'] = parsed('#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div.mt-0.mt-sm-1.stat_pane_stat_column.d-block.d-sm-none.d-md-block > div:nth-child(2) > div.mx-2.mt-2.pt-1 > h5').text()
    data['uuid_discovered'] = parsed("#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div.mt-0.mt-sm-1.stat_pane_stat_column.d-block.d-sm-none.d-md-block > div:nth-child(3) > div.mx-2.mt-2.pt-1 > h5").text()
    parsed('#page_content_body > div.mx-0.mx-sm-3').each((i, e) => {
        for (let x = 0; x < users; x++) {
            var id
            var name
            var plr = parsed(e).find(`div:nth-child(${count}) > div > div:nth-child(1) > div.mt-2.mb-1.text-center.text-truncate > a`)
            try {
                name = plr.text();
                id = parseInt(plr.attr('href').replace('/player/', ''))
            } catch (e) {
                name = "Hidden/Deleted";
                id = undefined
            }
            var updated_since = parsed(e).find(`div:nth-child(${count}) > div > div.mt-4.pt-2 > h5`).text()
            var updated_date = parsed(e).find(`div:nth-child(${count}) > div > div.mt-4.pt-2 > p.mb-0.text-center.small.text-muted`).text()
            data['history'].push({
                id,
                name,
                updated_since,
                updated_date
            })
            count = count + 1
        }
    })
    return data
}

module.exports = { 
    getItems,
    clear_cache,
    searchItem,
    getUAID
}
