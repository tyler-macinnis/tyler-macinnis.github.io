/* ============================================================
   ✏️  EDIT THIS FILE TO UPDATE THE WEBSITE
   ------------------------------------------------------------
   Everything visible on the site — hero, about, experience,
   projects, skills, education, contact, and even the terminal
   responses — is generated from the SITE_DATA object below.

   Just edit the text and refresh the page. No other file
   needs to change for content updates.
   ============================================================ */

const SITE_DATA = {
    /* ---------- Identity (hero + nav + meta) ---------- */
    name: "Tyler MacInnis",
    username: "tyler@macinnis", // shown in nav + terminal prompt
    email: "thmac2017@gmail.com",

    // GitHub username — used to pull live repos + activity onto the page.
    githubUsername: "tyler-macinnis",

    // Phrases the hero typewriter cycles through (first one shows
    // if the visitor prefers reduced motion).
    typewriterPhrases: [
        "Embedded Software Engineer",
        "Reverse Engineering Enthusiast",
        "AI & ML Explorer",
        "Firmware Tinkerer",
        "C/C++ Developer",
    ],

    /* ---------- Social links ---------- */
    socials: [
        { label: "GitHub", url: "https://github.com/tyler-macinnis" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/tyler-macinnis-compsci/" },
        { label: "Instagram", url: "https://www.instagram.com/tyler_macinnis1/" },
    ],

    /* ---------- About ---------- */
    about: {
        photo: "images/profile.jpg",
        // Each string is one paragraph. Basic inline HTML like
        // <strong> is allowed here.
        paragraphs: [
            `Hi, my name is Tyler MacInnis, and I am an Embedded Software Engineer at Atlas Copco (BeaconMedaes).
       I aspire to use my computing skills to help make my corner of the world a better place.
       I have a strong work ethic and passion for using my talents.`,
            `These days my curiosity lives at the low level — taking software apart through
       <strong>reverse engineering</strong> and exploring what's possible with
       <strong>artificial intelligence</strong>. If it runs on bare metal or thinks for
       itself, I want to understand how.`,
        ],
        // The "code style" fact list under the about text.
        facts: [
            { key: "role", value: '"Embedded Software Engineer"' },
            { key: "employer", value: '"Atlas Copco (BeaconMedaes)"' },
            { key: "interests", value: '["reverse engineering", "AI/ML", "firmware"]' },
            { key: "education", value: '"B.S. Computer Science, Clemson"' },
        ],
    },

    /* ---------- Experience (newest first) ---------- */
    experience: [
        {
            title: "Embedded Software Engineer",
            org: "Atlas Copco (BeaconMedaes)",
            date: "January 2023 — Present",
            bullets: [
                "Maintain proper testing, documentation, and release procedures and automation",
                "Maintain internal software applications",
                "Keep development strategies up to date",
            ],
        },
        {
            title: "Embedded Systems Intern",
            org: "Atlas Copco (BeaconMedaes)",
            date: "June 2022 — August 2022",
            bullets: [
                "Developed versatile unit testing and software validation procedures that can be used for a wide range of embedded systems, both legacy and future",
                "Improved legacy code performance while ensuring functionality was preserved",
                "Created detailed documentation on implementing best practices for software testing procedures",
            ],
        },
        {
            title: "Loader/Unloader",
            org: "DHL Supply Chain",
            date: "June 2021 — August 2021",
            bullets: [
                "Unloaded product deliveries",
                "Maintained cleanliness of the warehouse",
                "Assessed inventory accuracy",
            ],
        },
        {
            title: "Assistant Geodetic Technician",
            org: "SCDOT York Maintenance",
            date: "May 2019 — August 2019",
            bullets: [
                "Created and improved multiple complex spreadsheets with adaptability and user-friendliness as key design elements",
                "Designed a future-ready Excel Spreadsheet for assessing work crew progress",
                "Improved systems for tracking PPE and maintaining current Safety Data Sheets",
                "Assisted in Driveway Inspections throughout York County",
            ],
        },
        {
            title: "Cashier and Personal Shopper",
            org: "Harris Teeter Grocery Store",
            date: "November 2018 — January 2019",
            bullets: [
                "Handled monetary transactions with accuracy and proficiency",
                "Provided world-class customer service by answering questions and assisting customers",
                "Used situational awareness and grocery store knowledge to find product substitutions when appropriate",
                "Developed skills and techniques in maintaining optimism and tactfulness regardless of the situation",
            ],
        },
    ],

    /* ---------- Projects ---------- */
    projects: [
        {
            title: "Good Driver Incentive Program",
            tags: "AWS · Django",
            icon: "truck", // available icons: truck, bot, chip, code
            description:
                "For my senior project, I was the leader for a group project creating a Truck Driver Rewards program using AWS and Django.",
            link: null, // set to { label, url } to show a link
        },
        {
            title: "ClemBot Contributor",
            tags: "Python · Discord",
            icon: "bot",
            description:
                "A Discord Bot for the Clemson Computer Science Discord Server. I began contributing to this project in September of 2020 as a way of learning Python and git. It continues to grow thanks to the efforts of Clemson Students and Alumni.",
            link: {
                label: "ClemsonCPSC-Discord/ClemBot",
                url: "https://github.com/ClemsonCPSC-Discord/ClemBot",
            },
        },
    ],

    /* ---------- Skills (each group becomes a card) ---------- */
    skills: [
        {
            group: "languages",
            items: ["C", "C++", "C#", "Java", "Python", "Ruby"],
        },
        {
            group: "tools",
            items: ["Git", "Windows", "Linux", "Visual Studio", "AWS", "Azure DevOps"],
        },
        {
            group: "foundations",
            items: [
                "Algorithms",
                "Data Structures",
                "Systems Analysis",
                "Software Development",
                "Machine Learning",
                "OOP",
            ],
        },
        {
            group: "strengths",
            items: [
                "Microsoft Excel Certified",
                "Adaptable & Flexible",
                "Collaboration & Teamwork",
                "Organization & Time Management",
                "Excellent Communicator",
                "Strong Work Ethic",
            ],
        },
    ],

    /* ---------- Education ---------- */
    education: [
        {
            school: "Clemson University",
            link: "https://www.clemson.edu/",
            degree: "Bachelor of Science in Computer Science",
            date: "December 2022 · Final GPA: 3.28",
        },
    ],

    /* ---------- Awards ---------- */
    awards: [
        "Eagle Scout — October 2014",
        "Scottish Rite JROTC Medal for Scholastic Excellence and Americanism — May 2015",
    ],

    /* ---------- Hobbies / "a little more about me" ---------- */
    hobbies: [
        "Reverse Engineering",
        "Dungeons & Dragons",
        "Reading",
        "Running",
        "Hiking",
        "Gaming",
        "Watching Shows and Movies"
    ],

    /* ---------- Contact section ---------- */
    contact: {
        blurb:
            "Whether it's embedded systems, reverse engineering, AI, or anything in between — I'd love to hear from you.",
    },
};
