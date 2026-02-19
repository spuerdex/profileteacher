const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const courses = [
    {
        codeNumber: 'CS101',
        nameTh: 'ความรู้เบื้องต้นเกี่ยวกับวิทยาการคอมพิวเตอร์',
        nameEn: 'Introduction to Computer Science',
        descriptionTh: 'วิชาปรับพื้นฐานสำหรับนักศึกษาปี 1 ครอบคลุมเนื้อหาเรื่อง Algorithm, Data Structure และพื้นฐานคอมพิวเตอร์',
        semester: '1/2568'
    },
    {
        codeNumber: 'IT202',
        nameTh: 'ระบบฐานข้อมูลและการออกแบบ',
        nameEn: 'Database Systems and Design',
        descriptionTh: 'การออกแบบฐานข้อมูลเชิงสัมพันธ์, การเขียน SQL และการจัดการธุรกรรม (Transactions)',
        semester: '2/2567'
    },
    {
        codeNumber: 'SE303',
        nameTh: 'วิศวกรรมซอฟต์แวร์',
        nameEn: 'Software Engineering',
        descriptionTh: 'กระบวนการผลิตซอฟต์แวร์, Agile, DevOps และการเขียนเอกสารออกแบบระบบ',
        semester: '1/2567'
    },
    {
        codeNumber: 'AI401',
        nameTh: 'ปัญญาประดิษฐ์เบื้องต้น',
        nameEn: 'Introduction to Artificial Intelligence',
        descriptionTh: 'ทฤษฎีพื้นฐานของ AI, Machine Learning และระบบผู้เชี่ยวชาญ',
        semester: '2/2567'
    }
];

async function main() {
    console.log('🌱 Adding mock courses (using raw SQL)...');

    const teacher = await prisma.teacher.findFirst();
    if (!teacher) {
        console.error('❌ No teacher found.');
        process.exit(1);
    }

    console.log(`👤 Found teacher: ${teacher.firstNameTh} ${teacher.lastNameTh} (ID: ${teacher.id})`);

    // Add specific courses
    for (const course of courses) {
        const check = await prisma.$queryRaw`
            SELECT id FROM Course WHERE teacherId = ${teacher.id} AND codeNumber = ${course.codeNumber} LIMIT 1
        `;

        if (check.length === 0) {
            await prisma.$executeRaw`
                INSERT INTO Course (
                    teacherId, codeNumber, nameTh, nameEn, descriptionTh, semester, createdAt, updatedAt
                ) VALUES (
                    ${teacher.id}, ${course.codeNumber}, ${course.nameTh}, ${course.nameEn}, ${course.descriptionTh}, ${course.semester}, NOW(), NOW()
                )
            `;
            console.log(`✅ Added: ${course.codeNumber} - ${course.nameTh}`);
        } else {
            console.log(`⚠️ Skipped: ${course.codeNumber} (exists)`);
        }
    }

    // Add 12 generic ones for pagination testing
    for (let i = 1; i <= 12; i++) {
        const codeNumber = `GEN${100 + i}`;
        const nameTh = `วิชาพื้นฐานทั่วไป ${i}`;
        const check = await prisma.$queryRaw`
            SELECT id FROM Course WHERE teacherId = ${teacher.id} AND codeNumber = ${codeNumber} LIMIT 1
        `;

        if (check.length === 0) {
            await prisma.$executeRaw`
                INSERT INTO Course (
                    teacherId, codeNumber, nameTh, nameEn, descriptionTh, semester, createdAt, updatedAt
                ) VALUES (
                    ${teacher.id}, ${codeNumber}, ${nameTh}, ${`General Course ${i}`}, 'Course description placeholder', '1/2568', NOW(), NOW()
                )
            `;
            console.log(`✅ Added mock: ${codeNumber}`);
        }
    }

    console.log('🎉 Mock courses added successfully!');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
