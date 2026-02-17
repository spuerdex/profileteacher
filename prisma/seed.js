const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const themePresets = [
    { name: 'Ocean Blue', slug: 'ocean-blue', primary: '#3b82f6', primaryLight: '#60a5fa', primaryDark: '#2563eb', accent: '#06b6d4', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', isDefault: true },
    { name: 'Royal Purple', slug: 'royal-purple', primary: '#8b5cf6', primaryLight: '#a78bfa', primaryDark: '#7c3aed', accent: '#d946ef', gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)', isDefault: false },
    { name: 'Forest Green', slug: 'forest-green', primary: '#10b981', primaryLight: '#34d399', primaryDark: '#059669', accent: '#14b8a6', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', isDefault: false },
    { name: 'Rose Red', slug: 'rose-red', primary: '#f43f5e', primaryLight: '#fb7185', primaryDark: '#e11d48', accent: '#f97316', gradient: 'linear-gradient(135deg, #f43f5e, #f97316)', isDefault: false },
    { name: 'Sunset Orange', slug: 'sunset-orange', primary: '#f97316', primaryLight: '#fb923c', primaryDark: '#ea580c', accent: '#eab308', gradient: 'linear-gradient(135deg, #f97316, #eab308)', isDefault: false },
    { name: 'Teal', slug: 'teal', primary: '#14b8a6', primaryLight: '#2dd4bf', primaryDark: '#0d9488', accent: '#06b6d4', gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)', isDefault: false },
    { name: 'Sakura Pink', slug: 'sakura-pink', primary: '#ec4899', primaryLight: '#f472b6', primaryDark: '#db2777', accent: '#a855f7', gradient: 'linear-gradient(135deg, #ec4899, #a855f7)', isDefault: false },
    { name: 'Amber Gold', slug: 'amber-gold', primary: '#f59e0b', primaryLight: '#fbbf24', primaryDark: '#d97706', accent: '#ef4444', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', isDefault: false },
];

async function main() {
    console.log('🌱 Seeding database...');

    // Create theme presets
    console.log('🎨 Creating theme presets...');
    for (const theme of themePresets) {
        await prisma.themePreset.upsert({
            where: { slug: theme.slug },
            update: theme,
            create: theme,
        });
    }

    const defaultTheme = await prisma.themePreset.findFirst({ where: { isDefault: true } });

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@system.com' },
        update: {},
        create: {
            email: 'admin@system.com',
            password: adminPassword,
            role: 'admin',
        },
    });

    // Create sample teacher
    console.log('👨‍🏫 Creating sample teacher...');
    const teacher = await prisma.teacher.upsert({
        where: { slug: 'somchai-jaidee' },
        update: {},
        create: {
            slug: 'somchai-jaidee',
            titleTh: 'ผศ.ดร.',
            firstNameTh: 'สมชาย',
            lastNameTh: 'ใจดี',
            titleEn: 'Asst. Prof. Dr.',
            firstNameEn: 'Somchai',
            lastNameEn: 'Jaidee',
            position: 'ผู้ช่วยศาสตราจารย์',
            department: 'ภาควิชาวิทยาการคอมพิวเตอร์',
            email: 'somchai@university.ac.th',
            phone: '02-xxx-xxxx',
            bioTh: 'ผู้ช่วยศาสตราจารย์ สาขาวิทยาการคอมพิวเตอร์ มีความเชี่ยวชาญด้าน AI และ Machine Learning',
            bioEn: 'Assistant Professor in Computer Science, specializing in AI and Machine Learning',
            themePresetId: defaultTheme?.id || 1,
        },
    });

    const teacherPassword = await bcrypt.hash('teacher123', 10);
    await prisma.user.upsert({
        where: { email: 'somchai@university.ac.th' },
        update: {},
        create: {
            email: 'somchai@university.ac.th',
            password: teacherPassword,
            role: 'teacher',
            teacherId: teacher.id,
        },
    });

    // Add sample research
    await prisma.research.create({
        data: {
            teacherId: teacher.id,
            titleTh: 'การประยุกต์ใช้ปัญญาประดิษฐ์ในการวิเคราะห์ข้อมูลขนาดใหญ่',
            titleEn: 'Application of Artificial Intelligence in Big Data Analysis',
            abstractTh: 'งานวิจัยนี้นำเสนอแนวทางการใช้ AI ในการวิเคราะห์ข้อมูลขนาดใหญ่',
            abstractEn: 'This research presents approaches to using AI for Big Data Analysis',
            year: 2024,
            type: 'journal',
        },
    });

    // Add sample activity
    await prisma.activity.create({
        data: {
            teacherId: teacher.id,
            titleTh: 'วิทยากรบรรยายเรื่อง AI สำหรับการศึกษา',
            titleEn: 'Speaker on AI for Education',
            descriptionTh: 'ได้รับเชิญเป็นวิทยากรในงานสัมมนาวิชาการด้าน AI',
            date: new Date('2024-06-15'),
        },
    });

    // Add sample course
    await prisma.course.create({
        data: {
            teacherId: teacher.id,
            codeNumber: 'CS101',
            nameTh: 'ปัญญาประดิษฐ์เบื้องต้น',
            nameEn: 'Introduction to Artificial Intelligence',
            descriptionTh: 'รายวิชาพื้นฐานเกี่ยวกับปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง',
            semester: '1/2567',
        },
    });

    // Add sample education
    await prisma.education.create({
        data: {
            teacherId: teacher.id,
            degree: 'Ph.D.',
            field: 'Computer Science',
            institution: 'MIT',
            year: 2015,
        },
    });

    // System settings
    await prisma.systemSettings.upsert({
        where: { key: 'institution_name' },
        update: {},
        create: { key: 'institution_name', value: 'มหาวิทยาลัย' },
    });
    await prisma.systemSettings.upsert({
        where: { key: 'institution_name_en' },
        update: {},
        create: { key: 'institution_name_en', value: 'University' },
    });

    console.log('✅ Seed completed!');
    console.log('');
    console.log('📋 Login credentials:');
    console.log('   Admin: admin@system.com / admin123');
    console.log('   Teacher: somchai@university.ac.th / teacher123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
