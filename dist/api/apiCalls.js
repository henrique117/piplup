"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const apiAuth_1 = require("./apiAuth");
const dbQuerys_1 = require("../database/dbQuerys");
class ApiCalls {
    async updatePlayers() {
        const token = await (0, apiAuth_1.default)();
        const countries = ['BR', 'US', 'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AP', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'BQ', 'KY', 'TD', 'CL', 'CN', 'CX', 'CO', 'KM', 'CG', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'EE', 'SZ', 'ET', 'EU', 'FK', 'FO', 'FM', 'FJ', 'FI', 'FR', 'GF', 'PF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GY', 'HT', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IQ', 'IE', 'IR', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'XK', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LY', 'LI', 'LT', 'LU', 'MO', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'MK', 'MP', 'NO', 'OM', 'PK', 'PW', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SO', 'ZA', 'KR', 'SS', 'ES', 'LK', 'PS', 'SD', 'SR', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TH', 'CD', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'UG', 'UA', 'AE', 'GB', 'TZ', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'YE', 'ZM', 'ZW'];
        for (const country_inArray of countries) {
            let page = 1;
            let isFinished = false;
            while (!isFinished) {
                try {
                    const response = await axios_1.default.get('https://osu.ppy.sh/api/v2/rankings/osu/performance', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        params: {
                            country: country_inArray,
                            page: page
                        }
                    });
                    const players = [];
                    const data = response.data.ranking;
                    data.forEach((player) => {
                        if (player.global_rank >= 99999) {
                            isFinished = true;
                        }
                        else {
                            players.push({
                                player_name: player.user.username,
                                player_rank: player.global_rank,
                                player_pfp: player.user.avatar_url
                            });
                        }
                    });
                    if (players.length > 0) {
                        (0, dbQuerys_1.insertPlayersInArray)(players);
                    }
                    else {
                        isFinished = true;
                    }
                    if (page > 199) {
                        isFinished = true;
                    }
                    else
                        page++;
                }
                catch (err) {
                    console.error(`Error fetching players for ${country_inArray}:`, err);
                    isFinished = true;
                }
            }
            console.log(`${country_inArray} is done`);
        }
        console.log('Process ended');
    }
    async getPlayerById(id) {
        const token = await (0, apiAuth_1.default)();
        let player;
        try {
            const response = await axios_1.default.get(`https://osu.ppy.sh/api/v2/users/${id}/osu`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.data;
            player = {
                player_name: data.username,
                player_pfp: data.avatar_url,
                player_rank: data.statistics.global_rank
            };
            return player;
        }
        catch (err) {
            console.error(`Error fetching player: ${id}`, err);
            return null;
        }
    }
}
exports.default = ApiCalls;
