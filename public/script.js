window.onload = function() {
    loadData();
};

function loadData() {
    fetch('http://localhost:3000/api/matches')
        .then(response => response.json())
        .then(data => {
            let tbody = document.getElementById('matches');
            tbody.innerHTML = "";
            data.forEach(match => {
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
            
        })
        .catch(error => console.error(error));
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
}

function reloadData() {
    loadData();
}