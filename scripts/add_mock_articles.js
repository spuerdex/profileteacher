const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find teacher Somchai
    // You might need to adjust the where clause if slug is different
    const teacher = await prisma.teacher.findFirst({
        where: {
            OR: [
                { slug: 'somchai' },
                { slug: 'somchai-jaidee' },
                { firstNameTh: { contains: 'สมชาย' } }
            ]
        }
    });

    if (!teacher) {
        console.log('Teacher Somchai not found!');
        return;
    }

    console.log(`Found teacher: ${teacher.firstNameTh} ${teacher.lastNameTh} (${teacher.id})`);

    // Create mock articles
    const articles = [];
    for (let i = 1; i <= 25; i++) {
        articles.push({
            teacherId: teacher.id,
            title: `บทความทดสอบที่ ${i}: การพัฒนาเทคโนโลยีการศึกษาในยุค AI`,
            content: `นี่คือเนื้อหาจำลองสำหรับบทความที่ ${i} ครับ... \n\nในยุคปัจจุบัน AI มีบทบาทสำคัญอย่างมากในการศึกษา... (Mock Content) \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            coverImage: null, // Or add a placeholder URL if needed
            published: true,
            createdAt: new Date(Date.now() - i * 86400000) // Backdate to test sorting
        });
    }

    for (const article of articles) {
        await prisma.article.create({ data: article });
        console.log(`Created article: ${article.title}`);
    }

    console.log('Done adding mock articles.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
