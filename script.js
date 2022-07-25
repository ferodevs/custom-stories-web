const escapeHTML = c => c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#39;').replace(/\//g, '&#x2F;');

async function load(execute, guild) {
    try {
        const userReq = await fetch("http://localhost:8001/user", {
            credentials: "include"
        });
        const user = await userReq.json();

        if (user.error) {
            switch (user.error) {
                case "not_logged_in":
                    window.location.href = "http://localhost:8001/oauth2/login";
                    break;
                default:
                    throw user.error;
            }
            return;
        }

        if (typeof guild === "string") {
            const guildInfo = user.guilds.manage.find(g => g.id === guild);
            if (guildInfo) {
                // add another fetch here that gets server info
                return execute(user.user, guildInfo);
            }

            if (user.guilds.invite.find(g => g.id === guild)) {
                return window.location.href = `http://localhost:8001/oauth2/generate/${guild}`;
            } else {
                return window.location.href = "servers.html";
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