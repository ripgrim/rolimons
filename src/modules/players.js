const req = require('./request.js')
const cheerio = require('cheerio')

const website = "https://rolimons.com"
const leaderboard = website + "/leaderboard/"
const playerapi = "https://api.rolimons.com/players/v1/playerinfo/"

async function getPlayer(userID) {
    let player = await req.request(playerapi + userID)
    if (player && player.rateLimited) {
        console.log("[Rolimons] You are being rate limited by the API. Please wait and try again.");
        return { rateLimited: true };
    }
    if (!player || !player['data']) {
        return {};
    }
    return player['data']
}

async function getLeaderboard(page) {
    if (!page || page > 20) {
        return undefined
    }
    let players = []
    let count = 1
    const request = await req.request(leaderboard + page)
    if (request && request.rateLimited) {
        console.log("[Rolimons] You are being rate limited by the API. Please wait and try again.");
        return { rateLimited: true };
    }
    if (!request || !request['data']) {
        return [];
    }
    const parsed = cheerio.load(request['data'])
    parsed('#page_content_body > div.d-flex.justify-content-between.flex-wrap.px-3.mt-3').each((i, e) => {
        for (let x = 0; x < 50; x++) {
            var id = parseInt(parsed(e).find(`div:nth-child(${count}) > a`).attr('href').replace("/player/", ''))
            var name = parsed(e).find(`div:nth-child(${count}) > a > div:nth-child(1) > h6`).text()
            var rank = parsed(e).find(`div:nth-child(${count}) > a > div.px-2.pt-1 > div:nth-child(1) > div:nth-child(2) > span`).text()
            var value = parsed(e).find(`div:nth-child(${count}) > a > div.px-2.pt-1 > div:nth-child(2) > div:nth-child(2) > span`).text()
            var rap = parsed(e).find(`div:nth-child(${count}) > a > div.px-2.pt-1 > div:nth-child(3) > div:nth-child(2) > span`).text()
            players.push({
                id,
                name,
                rank,
                value,
                rap
            })
            count = count + 1
        }
    })
    return players
}

/**
 * Fetches the user's value chart data from their Rolimons profile page.
 * @param {number|string} userID - The Rolimons user ID.
 * @returns {Promise<Object>} The full chart data object from the site.
 */
async function getChartData(userID) {
    const profileUrl = `https://www.rolimons.com/player/${userID}`;

    try {
        const response = await req.request(profileUrl);
        if (!response || !response.data) {
            console.warn(`[getChartData] Empty response for user ${userID}`);
            return {};
        }

        const html = response.data;

        const chartMatch = html.match(/var\s+chart_data\s*=\s*({[\s\S]*?})\s*;/);
        const oldChartMatch = html.match(/var\s+old_chart_data\s*=\s*({[\s\S]*?})\s*;/);

        const result = {};

        if (chartMatch) {
            try {
                result.chart_data = JSON.parse(chartMatch[1]);
            } catch {
                result.chart_data = eval('(' + chartMatch[1] + ')');
            }
        }

        if (oldChartMatch) {
            try {
                result.old_chart_data = JSON.parse(oldChartMatch[1]);
            } catch {
                result.old_chart_data = eval('(' + oldChartMatch[1] + ')');
            }
        }

        return result;
    } catch (err) {
        console.error(`[getChartData] Failed to fetch: ${err.message}`);
        return {};
    }
}

module.exports = {
    getPlayer,
    getLeaderboard,
    getChartData
}
