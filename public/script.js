window.onload = function() {
    loadData();
};

function loadData() {
    fetch('http://localhost:3000/api/matches')
        .then(response => response.json())
        .then(data => {
            let oneHourAgo = (Date.now() - 60*60*1000)/1000;
            
            let matchesWithinOneHour = data.filter(match => Number(match.date) >= oneHourAgo);
            matchesWithinOneHour.sort((a, b) => Number(a.date) - Number(b.date));

            let matchesMoreThanOneHourAgo = data.filter(match => Number(match.date) < oneHourAgo);
            matchesMoreThanOneHourAgo.sort((a, b) => Number(b.date) - Number(a.date));
            
            let tbody = document.getElementById('matches');
            tbody.innerHTML = "";
            fillTable(matchesWithinOneHour, 'matches');
            fillTable(matchesMoreThanOneHourAgo, 'past_matches');
        })
        .catch(error => console.error(error));
}

function fillTable(matches, tableId) {
    let tbody = document.getElementById(tableId);
    tbody.innerHTML = "";
    matches.forEach(match => {
        row = tbody.insertRow(-1);
        row.insertCell().innerHTML = "";
        row.insertCell().innerHTML = getTeam(match.team1);
        row.insertCell().innerHTML = getImage(match.team1ImageUrl, match.team1);
        row.insertCell().innerHTML = getVS(match.team1, "vs");
        row.insertCell().innerHTML = getImage(match.team2ImageUrl, match.team2);
        row.insertCell().innerHTML = getTeam(match.team2);
        row.insertCell().innerHTML = "";
        row.insertCell().innerHTML = moment.unix(match.date).fromNow();
        row.insertCell().innerHTML = "";
        row.insertCell().innerHTML = moment.unix(match.date).format('DD. MMM - HH:mm');
        row.insertCell().innerHTML = "";
    });
}

function getImage(imageUrl, teamName) {
    return imageUrl ? '<img src="images/' + imageUrl + '" alt="' + teamName + '">' : '';
}
function getTeam(teamName) {
    return teamName == "TBD" ? '<span style="color: grey">TBD</span>' : teamName;
}
function getVS(teamName) {
    return teamName == "TBD" ? '<span style="color: grey">vs.</span>' : 'vs.';
}

function refreshData() {
    fetch('http://localhost:3000/api/refresh')
        .catch(error => console.error(error));
    console.log("Data refreshed");
}

function reloadData() {
    loadData();
    console.log("Data reloaded");
}