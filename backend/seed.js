const { execSync } = require("child_process");
const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const seeds = [
    { id: "1", name: "Site Config", script: "seed-site-config.js" },
    { id: "2", name: "FAQs", script: "seed-faqs.js" },
    { id: "3", name: "Pages", script: "seed-pages.js" },
];

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer.trim()));
    });
}

async function main() {
    console.log("\n🌱 Maison & Co — Database Seeder\n");
    console.log("What would you like to seed?\n");

    seeds.forEach((s) => console.log(`  ${s.id}. ${s.name}`));
    console.log("  A. All of the above\n");

    const answer = await ask("Select (1-3, A, or 'all'): ");
    const choice = answer.toLowerCase();

    let selected = [];
    if (choice === "a" || choice === "all") {
        selected = seeds;
    } else {
        const ids = choice.split(/[, ]+/).filter(Boolean);
        selected = seeds.filter((s) => ids.includes(s.id));
    }

    if (selected.length === 0) {
        console.log("\n❌ No valid selection. Exiting.");
        rl.close();
        return;
    }

    console.log(`\n🚀 Seeding: ${selected.map((s) => s.name).join(", ")}\n`);

    for (const seed of selected) {
        console.log(`\n── ${seed.name} ──`);
        try {
            const output = execSync(`node ${seed.script}`, {
                cwd: __dirname,
                stdio: "inherit",
            });
        } catch (err) {
            console.error(`❌ Failed to seed ${seed.name}`);
        }
    }

    console.log("\n✅ Done!\n");
    rl.close();
}

main();
