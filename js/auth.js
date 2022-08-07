const escapeHTML = c => c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#39;').replace(/\//g, '&#x2F;');

const server = 'https://stories_api.customrpg.xyz';
let guildID;

async function load(execute, guild) {
    try {
        const userReq = await fetch(`${server}/user`, {
            credentials: 'include'
        });
        const user = await userReq.json();

        if (user.error) {
            switch (user.error) {
                case 'not logged in':
                    window.location.href = `${server}/oauth2/login`;
                    break;
                default:
                    throw user.error;
            }
            return;
        }

        if (typeof guild === 'string') {
            if (user.guilds.manage.find(g => g.id === guild)) {
                const guildReq = await fetch(`${server}/guild/${guild}`, {
                    credentials: 'include'
                });
                const guildInfo = await guildReq.json();
                if (guildInfo.error) return window.location.href = 'servers.html';

                return execute(user.user, guildInfo);
            }

            if (user.guilds.invite.find(g => g.id === guild)) {
                return window.location.href = `${server}/oauth2/generate/${guild}`;
            } else {
                return window.location.href = 'servers.html';
            }
        } else {
            execute(user);
        }
    } catch(err) {
        console.error(err);
        setTimeout(() => {
            load(execute, guild);
        }, 5000);
    }
}

function logout() {
    window.location.href = `${server}/oauth2/logout`;
}