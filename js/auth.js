let currentUser = null;

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function handleCredentialResponse(response) {
    const payload = parseJwt(response.credential);
    if (payload) {
        const lastName = payload.family_name || payload.name || "Student";
        currentUser = {
            id: payload.sub,
            lastName: lastName
        };
        document.getElementById('google-btn-container').style.display = 'none';
        document.getElementById('login-hint').style.display = 'none';

        const welcomeEl = document.getElementById('user-welcome');
        welcomeEl.innerText = `🔔 Welcome, ${currentUser.lastName}!`;
        welcomeEl.style.display = 'block';
    }
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "73097478642-sejqkoo47r505bqcj1v2fnfrdpst3qj9.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("google-btn-container"),
        { theme: "outline", size: "large", shape: "pill", width: 250 }
    );
};
