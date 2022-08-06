load((user, guild) => {
    guildID = guild.info.id;

    document.getElementById('info').innerHTML = JSON.stringify({
        user,
        guild
    });

    document.getElementById('content').innerHTML = `
        <button onclick="window.location.href='server.html#${guild.info.id}'">Overview / Data</button>

        <h3>${guild.info.name} - Stories</h3>

        <p><button onclick="window.location.href='story.html#${guild.info.id}'">Create story part.</button></p>

        <div id="stories"></div>
    `;

    getStories();
}, window.location.hash.slice(1));

async function getStories() {
    const storiesReq = await fetch(`${server}/guild/${guildID}/stories`, {
        credentials: 'include'
    });
    
    const { stories, error } = await storiesReq.json();
    if (error) return alert(error);

    if (stories.length) {
        const storiesHTML = [];
        for (const part of stories) {
            console.log(part)
            storiesHTML.push(`
                <tr>
                    <td>${part.id}</td>
                    <td>${escapeHTML(part.title || part.description || part.image)}</td>
                    <td>
                        <button onclick="window.location.href='story.html#${guildID}#${part.id}'">Modify</button>
                        <button onclick="deletePart('${part.id}')">Delete</button>
                    </td>
                </tr>
            `);
        }

        document.getElementById('stories').innerHTML = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Content</th>
                    <th>Manage</th>
                </tr>
                ${storiesHTML.join('')}
            </table>
        `;
    } else {
        document.getElementById('stories').innerHTML = 'There are no story parts in this server currently.';
    }
}

async function deletePart(id) {
    const res = await fetch(`${server}/guild/797095798507700264/stories/${id}`, {
        credentials: 'include',
        method: 'delete'
    });

    alert(await res.text());
    window.location.reload();
}