const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const educationData = [
    {
        degree: 'Ph.D. in Computer Science',
        field: 'Artificial Intelligence and Machine Learning',
        institution: 'Stanford University',
        year: 2020
    },
    {
        degree: 'M.S. in Information Technology',
        field: 'Software Engineering',
        institution: 'Massachusetts Institute of Technology (MIT)',
        year: 2015
    },
    {
        degree: 'B.Sc. in Computer Engineering',
        field: 'Computer Systems',
        institution: 'Chulalongkorn University',
        year: 2012
    }
];

async function main() {
    console.log('🌱 Adding mock education data...');

    const teacher = await prisma.teacher.findFirst();
    if (!teacher) {
        console.error('❌ No teacher found.');
        process.exit(1);
    }

    console.log(`👤 Found teacher: ${teacher.firstNameTh} ${teacher.lastNameTh} (ID: ${teacher.id})`);

    for (const edu of educationData) {
        // Check if exists to avoid duplicates (approximate check by degree and institution)
        const check = await prisma.education.findFirst({
            where: {
                teacherId: teacher.id,
                degree: edu.degree,
                institution: edu.institution
            }
        });

        if (!check) {
            await prisma.education.create({
                data: {
                    teacherId: teacher.id,
                    ...edu
                }
            });
            console.log(`✅ Added: ${edu.degree} at ${edu.institution}`);
        } else {
            console.log(`⚠️ Skipped: ${edu.degree} (already exists)`);
        }
    }

    console.log('🎉 Mock education data added successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
