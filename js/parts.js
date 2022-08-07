load((user, guild) => {
    guildID = guild.info.id;

    document.getElementById('content').innerHTML = `
        <button onclick="window.location.href='overview.html#${guild.info.id}'">Overview</button>

        <h3>${guild.info.name} - Story Parts</h3>

        <p><button onclick="window.location.href='part.html#${guild.info.id}'">Create story part.</button></p>

        <div id="parts"></div>
    `;

    getParts();
}, window.location.hash.slice(1));

async function getParts() {
    const partsReq = await fetch(`${server}/guild/${guildID}/parts`, {
        credentials: 'include'
    });
    
    const { parts, error } = await partsReq.json();
    if (error) return alert(error);

    if (parts.length) {
        const partsHTML = [];
        for (const part of parts) {
            partsHTML.push(`
                <tr>
                    <td>${part.id}</td>
                    <td>${escapeHTML(part.title || part.description || part.image)}</td>
                    <td>
                        <button onclick="window.location.href='part.html#${guildID}#${part.id}'">Modify</button>
                        <button onclick="deletePart('${part.id}')">Delete</button>
                    </td>
                </tr>
            `);
        }

        document.getElementById('parts').innerHTML = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Content</th>
                    <th>Manage</th>
                </tr>
                ${partsHTML.join('')}
            </table>
        `;
    } else {
        document.getElementById('parts').innerHTML = 'There are no story parts in this server currently.';
    }
}

async function deletePart(id) {
    const res = await fetch(`${server}/guild/${guildID}/parts/${id}`, {
        credentials: 'include',
        method: 'delete'
    });

    alert(await res.text());
    window.location.reload();
}