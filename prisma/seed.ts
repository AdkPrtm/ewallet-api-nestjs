import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    //INPUT SEEDER OPERATOR CARD
    await prisma.operatorCard.createMany({
        data: [
            {
                name: 'Indosat',
                status: 'ACTIVE',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/operatorImage/indosat.png',
            },
            {
                name: 'Singtel',
                status: 'ACTIVE',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/operatorImage/singtel.png',
            },
            {
                name: 'Telkomsel',
                status: 'ACTIVE',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/operatorImage/telkomsel.png',
            },
        ],
        skipDuplicates: true,
    });

    const insertedCards = await prisma.operatorCard.findMany({
        where: {
            name: { in: ['Indosat', 'Singtel', 'Telkomsel'] },
        },
    });

    insertedCards.map(async (operatorCard) => {
        await prisma.dataPlan.createMany({
            data: [
                {
                    name: `10 GB ${operatorCard.name}`,
                    price: 100000,
                    operatorCardId: operatorCard.id,
                }, {
                    name: `20 GB ${operatorCard.name}`,
                    price: 200000,
                    operatorCardId: operatorCard.id,
                }, {
                    name: `30 GB ${operatorCard.name}`,
                    price: 300000,
                    operatorCardId: operatorCard.id,
                }
            ],
            skipDuplicates: true,
        })
    })

    const paymentMethodSeeder = await prisma.paymentMethod.createMany({
        data: [
            {
                name: 'Bank BNI',
                code: 'bni_va',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/bankImage/bni.png',
                status: 'ACTIVE',
            },
            {
                name: 'Bank BCA',
                code: 'bca_va',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/bankImage/bca.png',
                status: 'ACTIVE',
            },
            {
                name: 'QRIS',
                code: 'qris',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/bankImage/qris.png',
                status: 'ACTIVE',
            },
        ],
        skipDuplicates: true,
    })

    const tipsSeeder = await prisma.tip.createMany({
        data: [
            {
                title: 'Cara menyimpan uang yang baik',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/tips/nabung.jpg',
                url: 'https://blockchainmedia.id/cara-menabung-kripto-usdt-dan-usdc-di-pintu/'
            },
            {
                title: 'Cara berinvestasi emas',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/tips/emas.jpg',
                url: 'https://pintu.co.id/blog/cara-investasi-emas-bagi-pemula-agar-untung'
            },
            {
                title: 'Cara bermain saham',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/tips/saham.jpg',
                url: 'https://www.mncsekuritas.id/pages/3-tips-investasi-saham-untuk-pemula'
            },
        ],
        skipDuplicates: true,
    })

    const transactionTypeSeeder = await prisma.transactionType.createMany({
        data: [
            {
                name: 'Transfer',
                code: 'transfer',
                action: 'DR',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/transactionTypeImage/transfer.png'
            }, {
                name: 'Internet',
                code: 'internet',
                action: 'DR',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/transactionTypeImage/internet.png'
            }, {
                name: 'Top Up',
                code: 'topup',
                action: 'CR',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/transactionTypeImage/top_up.png'
            }, {
                name: 'Receive',
                code: 'receive',
                action: 'CR',
                thumbnail: 'https://cjjcrnpxqseybmskoqhh.supabase.co/storage/v1/object/public/ewalletapp/transactionTypeImage/receive.png'
            }
        ],
        skipDuplicates: true,
    })

    console.log({
        paymentMethodSeeder,
        tipsSeeder,
        transactionTypeSeeder
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })