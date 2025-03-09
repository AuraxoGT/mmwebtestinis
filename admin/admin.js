// admin.js - Admin Panel with JSONBin API

const JSONBIN_API_KEY = "$2a$10$Fhj82wgpsjkF/dgzbqlWN.bvyoK3jeIBkbQm9o/SSzDo9pxNryLi.";
const JSONBIN_BLACKLIST_ID = "67c851f6e41b4d34e4a1358b";

// Function to fetch data from JSONBin
async function fetchFromJsonBin(binId) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
            headers: {
                "X-Master-Key": JSONBIN_API_KEY
            }
        });
        const data = await response.json();
        console.log("📥 Fetched data:", data.record);
        return data.record;
    } catch (error) {
        console.error("❌ Error fetching from JSONBin:", error);
        return null;
    }
}

// Function to update JSONBin
async function updateJsonBin(binId, newData) {
    try {
        await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": JSONBIN_API_KEY
            },
            body: JSON.stringify(newData)
        });
        console.log("✅ Successfully updated JSONBin:", newData);
    } catch (error) {
        console.error("❌ Error updating JSONBin:", error);
    }
}

// Ensure elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", async function() {
    const closeBtn = document.getElementById("closeApplications");
    const addBlacklistBtn = document.getElementById("addBlacklist");
    const removeBlacklistBtn = document.getElementById("removeBlacklist");

    if (closeBtn) {
        closeBtn.addEventListener("click", async function() {
            await updateJsonBin(JSONBIN_BLACKLIST_ID, { applicationsClosed: true });
            alert("Anketos uždarytos!");
        });
    } else {
        console.warn("⚠️ closeApplications button not found!");
    }

    if (addBlacklistBtn) {
        addBlacklistBtn.addEventListener("click", async function() {
            let user = prompt("Įveskite vartotojo vardą, kurį norite pridėti į Blacklist:");
            if (user) {
                let blacklistData = await fetchFromJsonBin(JSONBIN_BLACKLIST_ID);
                if (!blacklistData || !Array.isArray(blacklistData.blacklist)) {
                    blacklistData = { blacklist: [] };
                }
                if (!blacklistData.blacklist.includes(user)) {
                    blacklistData.blacklist.push(user);
                    await updateJsonBin(JSONBIN_BLACKLIST_ID, blacklistData);
                    alert(`${user} pridėtas į Blacklist.`);
                } else {
                    alert("Šis vartotojas jau yra Blacklist'e!");
                }
            }
        });
    } else {
        console.warn("⚠️ addBlacklist button not found!");
    }

    if (removeBlacklistBtn) {
        removeBlacklistBtn.addEventListener("click", async function() {
            let user = prompt("Įveskite vartotojo vardą, kurį norite pašalinti iš Blacklist:");
            if (user) {
                let blacklistData = await fetchFromJsonBin(JSONBIN_BLACKLIST_ID);
                if (!blacklistData || !Array.isArray(blacklistData.blacklist)) {
                    alert("Blacklist nėra suformatuotas teisingai.");
                    return;
                }
                let index = blacklistData.blacklist.indexOf(user);
                if (index !== -1) {
                    blacklistData.blacklist.splice(index, 1);
                    await updateJsonBin(JSONBIN_BLACKLIST_ID, blacklistData);
                    alert(`${user} pašalintas iš Blacklist.`);
                } else {
                    alert("Šio vartotojo nėra Blacklist'e!");
                }
            }
        });
    } else {
        console.warn("⚠️ removeBlacklist button not found!");
    }
});
