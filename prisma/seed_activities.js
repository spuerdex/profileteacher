const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const activities = [
    {
        titleTh: 'อบรมเชิงปฏิบัติการ การใช้งาน AI เบื้องต้น',
        titleEn: 'Workshop on Introduction to AI',
        descriptionTh: 'การอบรมเชิงปฏิบัติการเกี่ยวกับการใช้งานปัญญาประดิษฐ์เบื้องต้นสำหรับบุคลากรทางการศึกษา',
        descriptionEn: 'A workshop on introductory AI usage for educational personnel.',
        date: new Date('2024-01-15T09:00:00Z'),
        type: 'training'
    },
    {
        titleTh: 'เข้าร่วมประชุมวิชาการระดับชาติ ครั้งที่ 5',
        titleEn: 'Attended the 5th National Academic Conference',
        descriptionTh: 'นำเสนอผลงานวิจัยในงานประชุมวิชาการระดับชาติ',
        descriptionEn: 'Presented research findings at the National Academic Conference.',
        date: new Date('2024-02-20T08:30:00Z'),
        type: 'conference'
    },
    {
        titleTh: 'บริการวิชาการแก่ชุมชน วัดดอนเมือง',
        titleEn: 'Academic Service to the Community at Wat Don Mueang',
        descriptionTh: 'ให้ความรู้เรื่องการดูแลสุขภาพผู้สูงอายุแก่ชุมชน',
        descriptionEn: 'Provided knowledge on elderly health care to the community.',
        date: new Date('2024-03-10T10:00:00Z'),
        type: 'community'
    },
    {
        titleTh: 'กรรมการสอบป้องกันวิทยานิพนธ์',
        titleEn: 'Thesis Defense Committee Member',
        descriptionTh: 'เป็นกรรมการสอบป้องกันวิทยานิพนธ์ของนักศึกษาระดับปริญญาโท',
        descriptionEn: 'Served as a thesis defense committee member for a master degree student.',
        date: new Date('2024-04-05T13:00:00Z'),
        type: 'committee'
    },
    {
        titleTh: 'ศึกษาดูงานด้านเทคโนโลยีที่ประเทศญี่ปุ่น',
        titleEn: 'Technology Study Trip in Japan',
        descriptionTh: 'ศึกษาดูงานด้านเทคโนโลยีและนวัตกรรมใหม่ๆ ที่ประเทศญี่ปุ่น',
        descriptionEn: 'Studied new technologies and innovations in Japan.',
        date: new Date('2024-05-12T09:00:00Z'),
        type: 'other'
    },
    {
        titleTh: 'อบรมพัฒนาศักยภาพอาจารย์ใหม่',
        titleEn: 'New Faculty Development Training',
        descriptionTh: 'เข้าร่วมโครงการพัฒนาศักยภาพอาจารย์ใหม่ เพื่อเตรียมความพร้อมในการสอน',
        descriptionEn: 'Participated in the new faculty development program to prepare for teaching.',
        date: new Date('2023-08-01T08:30:00Z'),
        type: 'training'
    },
    {
        titleTh: 'กรรมการตัดสินการประกวดโครงงานวิทยาศาสตร์',
        titleEn: 'Science Project Contest Judge',
        descriptionTh: 'ได้รับเชิญเป็นกรรมการตัดสินการประกวดโครงงานวิทยาศาสตร์ระดับมัธยมศึกษา',
        descriptionEn: 'Invited to judge a secondary school science project contest.',
        date: new Date('2023-09-15T09:00:00Z'),
        type: 'committee'
    },
    {
        titleTh: 'บรรยายพิเศษเรื่อง "อนาคตของการศึกษาไทย"',
        titleEn: 'Special Lecture on "The Future of Thai Education"',
        descriptionTh: 'เป็นวิทยากรบรรยายพิเศษในงานเสวนาวิชาการ',
        descriptionEn: 'Guest speaker at an academic seminar.',
        date: new Date('2023-11-20T10:00:00Z'),
        type: 'community'
    },
    {
        titleTh: 'เข้าร่วมอบรม Google for Education',
        titleEn: 'Attended Google for Education Training',
        descriptionTh: 'เรียนรู้การเครืองมือ Google for Education เพื่อนำมาประยุกต์ใช้ในการเรียนการสอน',
        descriptionEn: 'Learned Google for Education tools for teaching application.',
        date: new Date('2023-12-05T09:00:00Z'),
        type: 'training'
    },
    {
        titleTh: 'นำเสนอบทความวิชาการระดับนานาชาติ',
        titleEn: 'Presented International Academic Paper',
        descriptionTh: 'นำเสนอบทความวิชาการในงานประชุมระดับนานาชาติที่ประเทศสิงคโปร์',
        descriptionEn: 'Presented an academic paper at an international conference in Singapore.',
        date: new Date('2024-06-18T09:00:00Z'),
        type: 'conference'
    }
];

async function main() {
    console.log('🌱 Adding mock activities (using raw SQL due to schema mismatch)...');

    // Find the first teacher to add activities to
    const teacher = await prisma.teacher.findFirst();

    if (!teacher) {
        console.error('❌ No teacher found. Please create a teacher first.');
        process.exit(1);
    }

    console.log(`👤 Found teacher: ${teacher.firstNameTh} ${teacher.lastNameTh} (ID: ${teacher.id})`);

    // Add activities
    for (const activity of activities) {
        // Check if activity already exists (raw SQL)
        const checkExisting = await prisma.$queryRaw`
            SELECT id FROM Activity WHERE teacherId = ${teacher.id} AND titleTh = ${activity.titleTh} LIMIT 1
        `;

        if (checkExisting.length === 0) {
            await prisma.$executeRaw`
                INSERT INTO Activity (
                    teacherId, titleTh, titleEn, descriptionTh, descriptionEn, date, type, createdAt, updatedAt
                ) VALUES (
                    ${teacher.id}, ${activity.titleTh}, ${activity.titleEn}, ${activity.descriptionTh}, ${activity.descriptionEn}, ${activity.date}, ${activity.type}, NOW(), NOW()
                )
            `;
            console.log(`✅ Added: ${activity.titleTh}`);
        } else {
            console.log(`⚠️ Skipped (exists): ${activity.titleTh}`);
        }
    }

    // Add 15 more generic mock items to test pagination
    for (let i = 1; i <= 15; i++) {
        const title = `กิจกรรมทดสอบระบบ ${i}`;
        const date = new Date(new Date().setDate(new Date().getDate() - i));
        const type = ['training', 'conference', 'community', 'committee', 'other'][i % 5];
        const titleEn = `Mock Activity Test ${i}`;
        const descriptionTh = `รายละเอียดสำหรับการทดสอบกิจกรรมที่ ${i} เพื่อทดสอบระบบ Pagination`;
        const descriptionEn = `Details for testing activity ${i} to test the Pagination system.`;

        const checkExisting = await prisma.$queryRaw`
            SELECT id FROM Activity WHERE teacherId = ${teacher.id} AND titleTh = ${title} LIMIT 1
        `;

        if (checkExisting.length === 0) {
            await prisma.$executeRaw`
                INSERT INTO Activity (
                    teacherId, titleTh, titleEn, descriptionTh, descriptionEn, date, type, createdAt, updatedAt
                ) VALUES (
                    ${teacher.id}, ${title}, ${titleEn}, ${descriptionTh}, ${descriptionEn}, ${date}, ${type}, NOW(), NOW()
                )
            `;
            console.log(`✅ Added generic mock: ${title}`);
        }
    }


    console.log('🎉 Mock activities added successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
