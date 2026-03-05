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
    const teacher = await prisma.teacher.upsert({
        where: { slug: 'somchai-jaidee' },
        update: {},
        create: {
            slug: 'somchai-jaidee',
            titleTh: 'อาจารย์',
            firstNameTh: 'สมชาย',
            lastNameTh: 'ใจดี',
            firstNameEn: 'Somchai',
            lastNameEn: 'Jaidee',
            email: 'teacher1@example.com',
            position: 'อาจารย์ประจำภาควิชา',
            department: 'วิทยาการคอมพิวเตอร์',
            themePresetId: defaultPreset.id,
            bioTh: 'ผู้เชี่ยวชาญด้านการพัฒนาซอฟต์แวร์และ AI',
            education: {
                create: [
                    {
                        degree: 'วท.บ. วิทยาการคอมพิวเตอร์',
                        institution: 'มหาวิทยาลัยเกษตรศาสตร์',
                        year: 2550,
                    },
                    {
                        degree: 'วท.ม. เทคโนโลยีสารสนเทศ',
                        institution: 'จุฬาลงกรณ์มหาวิทยาลัย',
                        year: 2555,
                    },
                ],
            },
        },
    });

    // find if user already exists with this teacherId to avoid P2002
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
