import { prisma } from './prisma'

export async function getDefaultUser() {
  let user = await prisma.user.findFirst()
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'guest@geoify.app',
        name: 'Guest',
        plan: 'free',
        credits: 9999,
        onboarded: true,
        category: 'beauty',
      },
    })
  }
  return user
}
