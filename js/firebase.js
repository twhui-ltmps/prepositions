import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCxOnHC0MU7ZXZ10pCLvBW4_G480gqUh2I",
    authDomain: "prepositions-971cd.firebaseapp.com",
    projectId: "prepositions-971cd",
    storageBucket: "prepositions-971cd.firebasestorage.app",
    messagingSenderId: "73097478642",
    appId: "1:73097478642:web:3e0ad63e1b751540016b6b",
    measurementId: "G-NZ02QSHNDT"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

window.saveToFirebase = async (data) => {
    const btn = document.getElementById('submit-score-btn');
    try {
        btn.innerText = "Uploading...";
        btn.disabled = true;

        const modeSuffix = `timed_${data.questionType}`;
        const docId = `${data.googleId}_${modeSuffix}`;

        const docRef = doc(db, "leaderboard", docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const oldData = docSnap.data();
            if (data.score <= oldData.score) {
                alert(`Your high score in this level is ${oldData.score} Points. Keep trying! 💪`);
                btn.innerText = "🚀 Upload Score";
                btn.disabled = false;

                document.getElementById('filter-mode').value = modeSuffix;
                showScreen('leaderboard-screen');
                fetchLeaderboard();
                return;
            }
        }

        await setDoc(docRef, {
            class: data.class,
            studentNum: data.studentNum,
            lastName: data.lastName,
            score: data.score,
            accuracy: data.accuracy,
            gameMode: "timed",
            questionType: data.questionType,
            timestamp: new Date()
        });

        alert("TASK COMPLETE! New high score saved! 🎉");
        document.getElementById('filter-mode').value = modeSuffix;
        showScreen('leaderboard-screen');
        fetchLeaderboard();
    } catch (e) {
        console.error("Error saving document: ", e);
        alert("Upload failed. Please check your connection.");
    } finally {
        btn.innerText = "🚀 Upload Score";
        btn.disabled = false;
    }
};

window.fetchLeaderboard = async () => {
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = "<tr><td colspan='6'>Loading... ⏳</td></tr>";

    const modeFilter = document.getElementById('filter-mode').value;
    const classFilter = document.getElementById('filter-class').value;

    let qType = modeFilter.split('_')[1];

    let queryConditions = [
        where("gameMode", "==", "timed"),
        where("questionType", "==", qType)
    ];

    if (classFilter !== "ALL") {
        queryConditions.push(where("class", "==", classFilter));
    }

    try {
        const q = query(collection(db, "leaderboard"), ...queryConditions, orderBy("score", "desc"), limit(30));
        const querySnapshot = await getDocs(q);

        tbody.innerHTML = "";
        let rank = 1;

        if (querySnapshot.empty) {
            tbody.innerHTML = "<tr><td colspan='6'>No high scores yet!</td></tr>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            let rankDisplay = rank === 1 ? "🥇 1" : rank === 2 ? "🥈 2" : rank === 3 ? "🥉 3" : rank;

            tbody.innerHTML += `
                <tr>
                    <td style="font-weight:bold; color: ${rank<=3?'var(--dora-red)':'inherit'};">${rankDisplay}</td>
                    <td>${data.class}</td>
                    <td>${data.studentNum}</td>
                    <td style="color: var(--dora-blue-dark); font-weight: bold;">${data.lastName || 'Student'}</td>
                    <td style="font-weight:bold; color:var(--dora-blue-dark); font-size:18px;">🔔 ${data.score}</td>
                    <td>${data.accuracy}%</td>
                </tr>
            `;
            rank++;
        });
    } catch (e) {
        console.error("Error fetching docs: ", e);
        tbody.innerHTML = `<tr><td colspan='6' style="color:red; font-size:13px;">
            Failed to load data. Firebase index may be missing.
        </td></tr>`;
    }
};
