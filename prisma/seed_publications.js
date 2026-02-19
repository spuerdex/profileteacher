const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const publications = [
    {
        titleTh: 'การพัฒนาแบบจำลองการเรียนรู้ของเครื่องเพื่อทำนายพฤติกรรมการออมของวัยรุ่น',
        titleEn: 'Development of Machine Learning Models to Predict Adolescent Saving Behavior',
        journal: 'Journal of Computer Science and Technology',
        year: 2024,
        doi: '10.1234/jcst.2024.001',
        link: 'https://example.com/pub1'
    },
    {
        titleTh: 'การวิเคราะห์ความพึงพอใจของผู้ใช้ต่อระบบรัฐบาลอิเล็กทรอนิกส์ในเขตพื้นที่ห่างไกล',
        titleEn: 'Analyzing User Satisfaction with E-Government Systems in Remote Areas',
        journal: 'Nakhon Pathom University Academic Journal',
        year: 2023,
        doi: '10.5678/npuj.2023.456',
        link: 'https://example.com/pub2'
    },
    {
        titleTh: 'การเปรียบเทียบประสิทธิภาพของอัลกอริทึมการค้นหาในข้อมูลขนาดใหญ่',
        titleEn: 'Efficient Comparison of Search Algorithms in Big Data',
        journal: 'International Conference on Information Systems',
        year: 2022,
        doi: '10.9012/icis.2022.089',
        link: 'https://example.com/pub3'
    },
    {
        titleTh: 'แนวทางการรักษาความมั่นคงปลอดภัยไซเบอร์สำหรับธนาคารพาณิชย์ขนาดเล็ก',
        titleEn: 'Cybersecurity Guidelines for Small Commercial Banks',
        journal: 'Cybersecurity Awareness Journal',
        year: 2023,
        doi: '10.2468/csaj.2023.111',
        link: ''
    },
    {
        titleTh: 'การใช้ IoT ในการทำเกษตรอัจฉริยะเพื่อพัฒนาคุณภาพข้าวไทย',
        titleEn: 'Using IoT in Smart Agriculture to Improve Thai Rice Quality',
        journal: 'Agriculture Innovation Review',
        year: 2021,
        doi: '10.1122/air.2021.005',
        link: 'https://example.com/pub5'
    }
];

async function main() {
    console.log('🌱 Adding mock publications (using raw SQL)...');

    const teacher = await prisma.teacher.findFirst();
    if (!teacher) {
        console.error('❌ No teacher found.');
        process.exit(1);
    }

    console.log(`👤 Found teacher: ${teacher.firstNameTh} ${teacher.lastNameTh} (ID: ${teacher.id})`);

    // Add specific publications
    for (const pub of publications) {
        const check = await prisma.$queryRaw`
            SELECT id FROM Publication WHERE teacherId = ${teacher.id} AND titleTh = ${pub.titleTh} LIMIT 1
        `;

        if (check.length === 0) {
            await prisma.$executeRaw`
                INSERT INTO Publication (
                    teacherId, titleTh, titleEn, journal, year, doi, link, createdAt, updatedAt
                ) VALUES (
                    ${teacher.id}, ${pub.titleTh}, ${pub.titleEn}, ${pub.journal}, ${pub.year}, ${pub.doi}, ${pub.link}, NOW(), NOW()
                )
            `;
            console.log(`✅ Added: ${pub.titleTh}`);
        } else {
            console.log(`⚠️ Skipped: ${pub.titleTh}`);
        }
    }

    // Add 15 generic ones for pagination testing
    for (let i = 1; i <= 15; i++) {
        const titleTh = `ผลงานวิจัยระดับชาติ เรื่องที่ ${i}`;
        const check = await prisma.$queryRaw`
            SELECT id FROM Publication WHERE teacherId = ${teacher.id} AND titleTh = ${titleTh} LIMIT 1
        `;

        if (check.length === 0) {
            await prisma.$executeRaw`
                INSERT INTO Publication (
                    teacherId, titleTh, titleEn, journal, year, doi, link, createdAt, updatedAt
                ) VALUES (
                    ${teacher.id}, ${titleTh}, ${`Mock Publication ${i}`}, 'Sample Journal', ${2020 + (i % 5)}, ${`10.789/mock.${i}`}, '', NOW(), NOW()
                )
            `;
            console.log(`✅ Added mock: ${titleTh}`);
        }
    }

    console.log('🎉 Mock publications added successfully!');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
