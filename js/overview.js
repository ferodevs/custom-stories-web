load((user, guild) => {
    guildID = guild.info.id;

    document.getElementById('content').innerHTML = `
        <h3>${guild.info.name} - Overview</h3>

        <p>
            Plan: <code>${guild.storyLength}</code> / <code>${guild.settings.plan}</code> story parts.
        </p>
        <p>
            Language: <select id="language">
                <option value="en-US">English</option>
            </select><br>
            Default embed color: <input id="default-embed-color" type="color" value="#${guild.settings.defaultEmbedColor}"><br>
            Start part: <input id="start-part" type="number" value="${guild.settings.startPart}"><br>
            Maximum save files: <input id="maximum-save-files" value="${guild.settings.maxSaveFiles}">
        </p>
        <p>
            <button onclick="setSettings()">Save</button>
        </p>

        <h4>Story</h4>
        <p><button onclick="window.location.href='parts.html#${guild.info.id}'">Story parts</button></p>

        <h4>Data</h4>
        <p>
            <button onclick="window.location.href='${server}/guild/${guild.info.id}/data/download'">Download</button>
            <button onclick="resetServer()">Reset</button>
        </p>
    `;
}, window.location.hash.slice(1));

async function setSettings() {
    const res = await fetch(`${server}/guild/${guildID}/settings`, {
        credentials: 'include',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language: document.getElementById('language').value,
            defaultEmbedColor: document.getElementById('default-embed-color').value.slice(1),
            startPart: Number(document.getElementById('start-part').value),
            maxSaveFiles: Number(document.getElementById('maximum-save-files').value)
        })
    });

    return alert(await res.text());
}

async function resetServer() {
    const res = await fetch(`${server}/guild/${guildID}/data/reset`, {
        credentials: 'include',
        method: 'delete'
    });

    alert(await res.text());
    return window.location.href = '/servers.html';
}