const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find a teacher to seed. I'll search for one.
    const teacher = await prisma.teacher.findFirst();

    if (!teacher) {
        console.log('No teacher found!');
        return;
    }

    console.log(`Found teacher: ${teacher.firstNameTh} ${teacher.lastNameTh} (${teacher.id})`);

    const researchItems = [];
    const types = ['Journal', 'Conference', 'Book Chapter'];

    for (let i = 1; i <= 35; i++) {
        const year = 2024 - Math.floor(i / 5); // Spread across years
        const type = types[i % 3];

        researchItems.push({
            teacherId: teacher.id,
            titleTh: `[${type}] การวิจัยเรื่องที่ ${i}: การประยุกต์ใช้นวัตกรรมดิจิทัลเพื่อการเรียนรู้`,
            titleEn: `[${type}] Research Topic ${i}: Application of Digital Innovation for Learning`,
            abstractTh: `บทคัดย่อภาษาไทยสำหรับงานวิจัยที่ ${i}... เนื้อหาโดยย่อเกี่ยวกับการศึกษาผลกระทบของการใช้นวัตกรรม...`,
            abstractEn: `English abstract for research item ${i}... This study investigates the impact of digital innovation...`,
            year: year,
            type: type,
            link: i % 3 === 0 ? 'https://example.com' : null,
        });
    }

    console.log(`Seeding ${researchItems.length} research items...`);

    for (const item of researchItems) {
        await prisma.research.create({ data: item });
        process.stdout.write('.');
    }

    console.log('\nDone seeding research items.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
