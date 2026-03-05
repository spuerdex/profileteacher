const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const commonPassword = '=bIiy{8e,kl6-';
    const hashedPassword = await bcrypt.hash(commonPassword, 10);

    console.log('--- Starting Seeding ---');

    // 1. Theme Presets (10 Professional Themes)
    console.log('Seeding 10 Theme Presets...');
    const themes = [
        {
            name: 'Modern Blue',
            slug: 'modern-blue',
            primary: '#2563eb',
            primaryLight: '#60a5fa',
            primaryDark: '#1e40af',
            accent: '#f59e0b',
            gradient: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            isDefault: true,
        },
        {
            name: 'Deep Purple',
            slug: 'deep-purple',
            primary: '#7c3aed',
            primaryLight: '#a78bfa',
            primaryDark: '#5b21b6',
            accent: '#10b981',
            gradient: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        },
        {
            name: 'Emerald Green',
            slug: 'emerald-green',
            primary: '#059669',
            primaryLight: '#34d399',
            primaryDark: '#065f46',
            accent: '#fbbf24',
            gradient: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
        },
        {
            name: 'Sunset Orange',
            slug: 'sunset-orange',
            primary: '#ea580c',
            primaryLight: '#fb923c',
            primaryDark: '#9a3412',
            accent: '#38bdf8',
            gradient: 'linear-gradient(135deg, #ea580c 0%, #9a3412 100%)',
        },
        {
            name: 'Royal Midnight',
            slug: 'royal-midnight',
            primary: '#1e293b',
            primaryLight: '#475569',
            primaryDark: '#0f172a',
            accent: '#f43f5e',
            gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        },
        {
            name: 'Rose Gold',
            slug: 'rose-gold',
            primary: '#be185d',
            primaryLight: '#f472b6',
            primaryDark: '#831843',
            accent: '#06b6d4',
            gradient: 'linear-gradient(135deg, #be185d 0%, #831843 100%)',
        },
        {
            name: 'Slate Professional',
            slug: 'slate-professional',
            primary: '#334155',
            primaryLight: '#64748b',
            primaryDark: '#1e293b',
            accent: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
        },
        {
            name: 'Ocean Teal',
            slug: 'ocean-teal',
            primary: '#0d9488',
            primaryLight: '#2dd4bf',
            primaryDark: '#115e59',
            accent: '#f97316',
            gradient: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
        },
        {
            name: 'Cherry Blossom',
            slug: 'cherry-blossom',
            primary: '#db2777',
            primaryLight: '#f472b6',
            primaryDark: '#9d174d',
            accent: '#10b981',
            gradient: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
        },
        {
            name: 'Forest Nature',
            slug: 'forest-nature',
            primary: '#166534',
            primaryLight: '#4ade80',
            primaryDark: '#064e3b',
            accent: '#facc15',
            gradient: 'linear-gradient(135deg, #166534 0%, #064e3b 100%)',
        },
    ];

    const presetObjects = {};
    for (const theme of themes) {
        const createdTheme = await prisma.themePreset.upsert({
            where: { slug: theme.slug },
            update: theme,
            create: theme,
        });
        presetObjects[theme.slug] = createdTheme;
    }

    // เลือก preset แรกเป็นค่าเริ่มต้นสำหรับอาจารย์ที่กำลังจะสร้าง
    const defaultPreset = presetObjects['modern-blue'];

    // 2. Admin User
    console.log('Seeding Admin User...');
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        },
    });

    // 3. Teacher and User for Teacher
    console.log('Seeding Teacher and Teacher User...');
    const teacherSlug = 'somchai-jaidee';
    const teacherData = {
        slug: teacherSlug,
        titleTh: 'ผู้ช่วยศาสตราจารย์',
        firstNameTh: 'สมชาย',
        lastNameTh: 'ใจดี',
        email: 'teacher1@example.com',
        phone: '081-234-5678',
        position: 'หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์',
        department: 'คณะเทคโนโลยีสารสนเทศ',
        themePresetId: defaultPreset.id,
        bioTh: 'ผู้เชี่ยวชาญด้านการพัฒนาซอฟต์แวร์, ปัญญาประดิษฐ์ (AI) และเทคโนโลยีบล็อกเชน (Blockchain) มีประสบการณ์กวา 15 ปีในการสอนและวิจัยด้านวิทยาการคอมพิวเตอร์',
    };

    const teacher = await prisma.teacher.upsert({
        where: { slug: teacherSlug },
        update: teacherData,
        create: teacherData,
    });

    // --- Related Data for Somchai (Clear and Re-seed) ---
    console.log('Cleaning and re-seeding detailed mock data for Somchai...');
    await prisma.education.deleteMany({ where: { teacherId: teacher.id } });
    await prisma.article.deleteMany({ where: { teacherId: teacher.id } });
    await prisma.research.deleteMany({ where: { teacherId: teacher.id } });
    await prisma.activity.deleteMany({ where: { teacherId: teacher.id } });
    await prisma.publication.deleteMany({ where: { teacherId: teacher.id } });
    await prisma.course.deleteMany({ where: { teacherId: teacher.id } });

    // Education
    await prisma.education.createMany({
        data: [
            { teacherId: teacher.id, degree: 'ศ.ดร. วิศวกรรมคอมพิวเตอร์', institution: 'University of Stanford', year: 2555 },
            { teacherId: teacher.id, degree: 'วท.ม. วิทยาการคอมพิวเตอร์', institution: 'จุฬาลงกรณ์มหาวิทยาลัย', year: 2550 },
            { teacherId: teacher.id, degree: 'วท.บ. วิทยาการคอมพิวเตอร์', institution: 'มหาวิทยาลัยเกษตรศาสตร์', year: 2545 },
        ]
    });

    // Articles
    await prisma.article.createMany({
        data: Array.from({ length: 5 }).map((_, i) => ({
            teacherId: teacher.id,
            title: `บทความที่ ${i + 1}: นวัตกรรมเทรนด์ใหม่ประจำปี 2024`,
            content: `เนื้อหาสำหรับบทความที่ ${i + 1} เกี่ยวกับเทคโนโลยีและอนาคต...`,
            published: true,
        }))
    });

    // Research
    await prisma.research.createMany({
        data: [
            { teacherId: teacher.id, titleTh: 'ระบบพยากรณ์ราคาสินค้าเกษตรด้วยปัญญาประดิษฐ์', year: 2566, type: 'วิจัยประยุกต์' },
            { teacherId: teacher.id, titleTh: 'การวิเคราะห์ Big Data สำหรับการท่องเที่ยวจังหวัดเชียงราย', year: 2565, type: 'วิจัยเชิงพื้นที่' },
        ]
    });

    // Activities
    await prisma.activity.createMany({
        data: [
            { teacherId: teacher.id, titleTh: 'วิทยากรพิเศษ "อนาคตของ AI ในภาคอุตสาหกรรม"', date: new Date('2023-11-10'), type: 'วิทยากร' },
            { teacherId: teacher.id, titleTh: 'คณะกรรมการตัดสินการแข่งขันหุ่นยนต์ระดับภาค', date: new Date('2023-10-15'), type: 'กรรมการ' },
            { teacherId: teacher.id, titleTh: 'ได้รับรางวัลอาจารย์ดีเด่นด้านการสอน ประจำปี 2566', date: new Date('2023-12-25'), type: 'รางวัล' },
        ]
    });

    // Publications
    await prisma.publication.createMany({
        data: [
            { teacherId: teacher.id, titleTh: 'A Study of Deep Learning in Image Processing', journal: 'International Computer Journal', year: 2023 },
            { teacherId: teacher.id, titleTh: 'Blockchain for Academic Record Verification', journal: 'Tech Innovation Thai', year: 2022 },
        ]
    });

    // Courses
    await prisma.course.createMany({
        data: [
            { teacherId: teacher.id, codeNumber: 'COS101', nameTh: 'วิทยาการคอมพิวเตอร์เบื้องต้น', semester: '1/2566' },
            { teacherId: teacher.id, codeNumber: 'COS202', nameTh: 'การโปรแกรมเชิงวัตถุ', semester: '2/2566' },
            { teacherId: teacher.id, codeNumber: 'COS404', nameTh: 'สัมมนาวิศวกรรมซอฟต์แวร์', semester: '1/2567' },
        ]
    });

    // 4. Update/Create User for Teacher
    console.log('Finalizing User account for Teacher...');
    const existingUserWithTeacher = await prisma.user.findUnique({
        where: { teacherId: teacher.id }
    });

    if (existingUserWithTeacher) {
        await prisma.user.update({
            where: { id: existingUserWithTeacher.id },
            data: {
                username: 'teacher1',
                email: 'teacher1@example.com',
                password: hashedPassword,
                role: 'teacher',
            }
        });
    } else {
        await prisma.user.upsert({
            where: { username: 'teacher1' },
            update: {
                teacherId: teacher.id,
            },
            create: {
                username: 'teacher1',
                email: 'teacher1@example.com',
                password: hashedPassword,
                role: 'teacher',
                teacherId: teacher.id,
            },
        });
    }

    console.log('--- Seeding Completed Successfully ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
